"""Scénarios internes fixes, réservés aux tests ; aucune saisie de code."""
import argparse
import subprocess
import sys
import time

parser = argparse.ArgumentParser()
parser.add_argument('scenario', choices=('timeout', 'volume', 'descendant', 'child'))
args = parser.parse_args()
if args.scenario != 'child' and sys.stdin.buffer.readline(16) != b'RUN\n':
    sys.exit(125)
if args.scenario == 'volume':
    for _ in range(40):
        sys.stdout.buffer.write(b'x' * 4096)
        sys.stdout.buffer.flush()
        sys.stderr.buffer.write(b'e' * 4096)
        sys.stderr.buffer.flush()
elif args.scenario == 'descendant':
    child = subprocess.Popen([sys.executable, '-B', __file__, 'child'], stdin=subprocess.DEVNULL)
    print(child.pid, flush=True)
    time.sleep(30)
else:
    print('démarrage', flush=True)
    time.sleep(30)
