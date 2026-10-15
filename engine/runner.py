"""Exécution bornée de trois exemples fixes ; ce module n'est pas une sandbox."""
import ctypes
import json
import math
import os
from pathlib import Path
import signal
import subprocess
import sys
import threading
from ctypes import wintypes

EXAMPLES = ('tokens', 'neuron', 'error')
PROBE = Path(__file__).resolve().with_name('probe.py')
MAX_REQUEST_BYTES = 4096


class WindowsJob:
    def __init__(self):
        class Basic(ctypes.Structure):
            _fields_ = [('PerProcessUserTimeLimit', ctypes.c_int64), ('PerJobUserTimeLimit', ctypes.c_int64),
                        ('LimitFlags', wintypes.DWORD), ('MinimumWorkingSetSize', ctypes.c_size_t),
                        ('MaximumWorkingSetSize', ctypes.c_size_t), ('ActiveProcessLimit', wintypes.DWORD),
                        ('Affinity', ctypes.c_size_t), ('PriorityClass', wintypes.DWORD), ('SchedulingClass', wintypes.DWORD)]
        class Counters(ctypes.Structure):
            _fields_ = [(name, ctypes.c_uint64) for name in ('ReadOperationCount', 'WriteOperationCount', 'OtherOperationCount', 'ReadTransferCount', 'WriteTransferCount', 'OtherTransferCount')]
        class Extended(ctypes.Structure):
            _fields_ = [('BasicLimitInformation', Basic), ('IoInfo', Counters),
                        ('ProcessMemoryLimit', ctypes.c_size_t), ('JobMemoryLimit', ctypes.c_size_t),
                        ('PeakProcessMemoryUsed', ctypes.c_size_t), ('PeakJobMemoryUsed', ctypes.c_size_t)]
        self.api = ctypes.WinDLL('kernel32', use_last_error=True)
        self.api.CreateJobObjectW.argtypes = [ctypes.c_void_p, wintypes.LPCWSTR]
        self.api.CreateJobObjectW.restype = wintypes.HANDLE
        self.api.SetInformationJobObject.argtypes = [wintypes.HANDLE, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD]
        self.api.SetInformationJobObject.restype = wintypes.BOOL
        self.api.AssignProcessToJobObject.argtypes = [wintypes.HANDLE, wintypes.HANDLE]
        self.api.AssignProcessToJobObject.restype = wintypes.BOOL
        self.api.IsProcessInJob.argtypes = [wintypes.HANDLE, wintypes.HANDLE, ctypes.POINTER(wintypes.BOOL)]
        self.api.IsProcessInJob.restype = wintypes.BOOL
        self.api.CloseHandle.argtypes = [wintypes.HANDLE]
        self.api.CloseHandle.restype = wintypes.BOOL
        self.handle = self.api.CreateJobObjectW(None, None)
        if not self.handle:
            raise ctypes.WinError(ctypes.get_last_error())
        info = Extended()
        info.BasicLimitInformation.LimitFlags = 0x2000
        if not self.api.SetInformationJobObject(self.handle, 9, ctypes.byref(info), ctypes.sizeof(info)):
            error = ctypes.WinError(ctypes.get_last_error())
            self.close()
            raise error

    def assign(self, process):
        if not self.api.AssignProcessToJobObject(self.handle, wintypes.HANDLE(int(process._handle))):
            raise ctypes.WinError(ctypes.get_last_error())
        member = wintypes.BOOL()
        if not self.api.IsProcessInJob(wintypes.HANDLE(int(process._handle)), self.handle, ctypes.byref(member)) or not member.value:
            raise RuntimeError('Affectation au Job Object non vérifiée.')

    def close(self):
        if self.handle:
            self.api.CloseHandle(self.handle)
            self.handle = None


def _result(stdout='', stderr='', exit_code=None, timed_out=False, truncated=False):
    return dict(stdout=stdout, stderr=stderr, exitCode=exit_code, timedOut=timed_out, truncated=truncated)


def _run_command(command, timeout_seconds=3.0, max_output_bytes=32768):
    """Interne uniquement : aucune commande fournie par la CLI."""
    buffers = [bytearray(), bytearray()]
    truncated = [False, False]
    env = os.environ.copy()
    env.update(PYTHONDONTWRITEBYTECODE='1', PYTHONIOENCODING='utf-8', PYTHONUNBUFFERED='1')
    job = WindowsJob() if os.name == 'nt' else None
    process = None
    readers = []
    timed_out = False

    def collect(pipe, index):
        try:
            while True:
                chunk = os.read(pipe.fileno(), 4096)
                if not chunk:
                    break
                remaining = max_output_bytes - len(buffers[index])
                buffers[index].extend(chunk[:remaining])
                if len(chunk) > remaining:
                    truncated[index] = True
        finally:
            pipe.close()

    try:
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                   cwd=str(PROBE.parent), env=env, shell=False,
                                   creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0,
                                   start_new_session=os.name != 'nt')
        if job:
            job.assign(process)
        for index, pipe in enumerate((process.stdout, process.stderr)):
            reader = threading.Thread(target=collect, args=(pipe, index), daemon=True)
            reader.start()
            readers.append(reader)
        process.stdin.write(b'RUN\n')
        process.stdin.close()
        try:
            process.wait(timeout=timeout_seconds)
        except subprocess.TimeoutExpired:
            timed_out = True
        finally:
            if job:
                job.close()
            else:
                try:
                    os.killpg(process.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
            process.wait(timeout=5)
        for reader in readers:
            reader.join(timeout=5)
        if any(reader.is_alive() for reader in readers):
            raise RuntimeError('Les flux du processus ne se sont pas fermés.')
        return _result(*(bytes(buf).decode('utf-8', errors='replace') for buf in buffers),
                       exit_code=process.returncode, timed_out=timed_out, truncated=any(truncated))
    finally:
        if job:
            job.close()
        if process:
            if process.poll() is None:
                process.kill()
                process.wait(timeout=5)
            for pipe in (process.stdin, process.stdout, process.stderr):
                if pipe and not pipe.closed:
                    pipe.close()


def run_request(request):
    if not isinstance(request, dict) or set(request) - {'example', 'timeoutSeconds', 'maxOutputBytes'}:
        raise ValueError('Objet JSON attendu ; seuls example, timeoutSeconds et maxOutputBytes sont acceptés.')
    example = request.get('example')
    if not isinstance(example, str) or example not in EXAMPLES:
        raise ValueError('Exemple non approuvé : tokens, neuron ou error attendu.')
    timeout = request.get('timeoutSeconds', 3.0)
    limit = request.get('maxOutputBytes', 32768)
    if isinstance(timeout, bool) or not isinstance(timeout, (int, float)) or not math.isfinite(timeout) or not 0.05 <= timeout <= 10:
        raise ValueError('timeoutSeconds doit être compris entre 0.05 et 10.')
    if isinstance(limit, bool) or not isinstance(limit, int) or not 256 <= limit <= 65536:
        raise ValueError('maxOutputBytes doit être un entier compris entre 256 et 65536.')
    return _run_command([sys.executable, '-B', str(PROBE), '--example', example, '--wait-for-parent'], timeout, limit)


def main():
    try:
        raw = sys.stdin.buffer.read(MAX_REQUEST_BYTES + 1)
        if len(raw) > MAX_REQUEST_BYTES:
            raise ValueError('Requête trop volumineuse (4096 octets maximum).')
        result = run_request(json.loads(raw.decode('utf-8')))
        status = 0
    except (ValueError, OSError, RuntimeError, subprocess.SubprocessError) as error:
        result = _result(stderr='Exécution refusée : ' + str(error))
        status = 2
    sys.stdout.write(json.dumps(result, ensure_ascii=False) + '\n')
    return status


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
    sys.exit(main())
