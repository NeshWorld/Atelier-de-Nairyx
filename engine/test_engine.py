"""Tests réels du moteur, bibliothèque standard exclusivement."""
import ctypes
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from ctypes import wintypes
import runner

ROOT = Path(__file__).resolve().parent


class EngineTests(unittest.TestCase):
    def fixture(self, name, **kwargs):
        return runner._run_command([sys.executable, '-B', str(ROOT / '_fixtures.py'), name], **kwargs)

    def test_tokens_reconstruct_exact_phrase(self):
        result = runner.run_request({'example': 'tokens'})
        self.assertEqual(result['exitCode'], 0, result)
        self.assertEqual(result['stderr'], '')
        data = json.loads(result['stdout'].splitlines()[1])
        self.assertEqual(''.join(data['tokens']), data['phrase'])
        self.assertEqual(len(data['tokens']), len(data['ids']))

    def test_neuron_computation(self):
        result = runner.run_request({'example': 'neuron'})
        self.assertEqual(result['exitCode'], 0, result)
        data = json.loads(result['stdout'].splitlines()[0])
        self.assertAlmostEqual(data['sum'], sum(a * b for a, b in zip(data['inputs'], data['weights'])) + data['bias'])
        self.assertEqual(data['relu'], max(0, data['sum']))

    def test_authentic_stderr_and_exit(self):
        result = runner.run_request({'example': 'error'})
        self.assertNotEqual(result['exitCode'], 0)
        self.assertIn('RuntimeError', result['stderr'])
        self.assertIn('Erreur pédagogique volontaire', result['stderr'])
        self.assertEqual(result['stdout'], '')

    def test_timeout_is_bounded(self):
        started = time.monotonic()
        result = self.fixture('timeout', timeout_seconds=0.3)
        self.assertTrue(result['timedOut'], result)
        self.assertIsInstance(result['exitCode'], int)
        self.assertLess(time.monotonic() - started, 5)

    def test_both_streams_are_drained_and_limited(self):
        result = self.fixture('volume', max_output_bytes=1024)
        self.assertEqual(result['exitCode'], 0, result)
        self.assertTrue(result['truncated'])
        self.assertEqual(result['stdout'], 'x' * 1024)
        self.assertEqual(result['stderr'], 'e' * 1024)

    def test_reject_invalid_requests(self):
        invalid = [None, [], {}, {'example': 'print(1)'}, {'example': '../probe.py'},
                   {'example': ['tokens']}, {'example': 'tokens', 'command': 'x'},
                   {'example': 'tokens', 'timeoutSeconds': True},
                   {'example': 'tokens', 'timeoutSeconds': float('nan')},
                   {'example': 'tokens', 'timeoutSeconds': 11},
                   {'example': 'tokens', 'maxOutputBytes': 1},
                   {'example': 'tokens', 'maxOutputBytes': True}]
        for request in invalid:
            with self.subTest(request=request), self.assertRaises(ValueError):
                runner.run_request(request)

    def test_cli_json_and_errors(self):
        for payload, expected_status in [(b'{"example":"neuron"}', 0), (b'not json', 2), (b'x' * 4097, 2)]:
            with self.subTest(payload=payload[:30]):
                process = subprocess.run([sys.executable, '-B', str(ROOT / 'runner.py')], input=payload, capture_output=True, timeout=10)
                self.assertEqual(process.returncode, expected_status, process.stderr)
                result = json.loads(process.stdout)
                self.assertEqual(set(result), {'stdout', 'stderr', 'exitCode', 'timedOut', 'truncated'})

    def test_path_with_apostrophe_and_accent(self):
        # Copie temporaire dans le dossier autorisé puis suppression automatique.
        with tempfile.TemporaryDirectory(prefix="preuve l'été ", dir=ROOT) as directory:
            target = Path(directory)
            for name in ('probe.py', 'runner.py'):
                shutil.copy2(ROOT / name, target / name)
            process = subprocess.run([sys.executable, '-B', str(target / 'runner.py')],
                                     input=b'{"example":"tokens"}', capture_output=True, timeout=10)
            self.assertEqual(process.returncode, 0, process.stderr)
            result = json.loads(process.stdout)
            self.assertEqual(result['exitCode'], 0, result)
            self.assertIn('L\'atelier', result['stdout'])

    @unittest.skipUnless(os.name == 'nt', 'Jobs imbriqués propres à Windows')
    def test_runner_under_parent_job(self):
        job = runner.WindowsJob()
        process = subprocess.Popen([sys.executable, '-B', str(ROOT / 'runner.py')],
                                   stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            job.assign(process)
            stdout, stderr = process.communicate(b'{"example":"tokens"}', timeout=10)
            self.assertEqual(process.returncode, 0, stderr)
            result = json.loads(stdout)
            self.assertEqual(result['exitCode'], 0, result)
        finally:
            job.close()
            process.wait(timeout=5)
    @unittest.skipUnless(os.name == 'nt', 'Vérification Job Object propre à Windows')
    def test_job_kills_descendant_on_timeout(self):
        result = self.fixture('descendant', timeout_seconds=0.5)
        self.assertTrue(result['timedOut'], result)
        pid = int(result['stdout'].splitlines()[0])
        api = ctypes.WinDLL('kernel32', use_last_error=True)
        api.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        api.OpenProcess.restype = wintypes.HANDLE
        api.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        api.WaitForSingleObject.restype = wintypes.DWORD
        api.CloseHandle.argtypes = [wintypes.HANDLE]
        handle = api.OpenProcess(0x00100000, False, pid)
        if not handle and ctypes.get_last_error() != 87:
            raise ctypes.WinError(ctypes.get_last_error())
        if handle:
            try:
                self.assertEqual(api.WaitForSingleObject(handle, 1000), 0, 'Descendant encore vivant après fermeture Job')
            finally:
                api.CloseHandle(handle)


if __name__ == '__main__':
    unittest.main(verbosity=2)


