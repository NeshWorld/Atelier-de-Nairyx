"""Exemples fixes sans dépendance tierce."""
import argparse
import json
import re
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--example', required=True, choices=('tokens', 'neuron', 'error'))
    parser.add_argument('--wait-for-parent', action='store_true', help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.wait_for_parent and sys.stdin.buffer.readline(16) != b'RUN\n':
        return 125
    if args.example == 'tokens':
        phrase = "L'atelier apprend avec l’IA : bonjour !"
        pieces = re.findall(r"\w+|[^\w\s]|\s+", phrase, flags=re.UNICODE)
        vocabulary = {piece: index for index, piece in enumerate(dict.fromkeys(pieces))}
        print('Découpage pédagogique par mots, ponctuation et espaces (pas un tokenizer de modèle).')
        print(json.dumps({'phrase': phrase, 'tokens': pieces, 'ids': [vocabulary[p] for p in pieces]}, ensure_ascii=False))
        assert ''.join(pieces) == phrase
        return 0
    if args.example == 'neuron':
        inputs, weights, bias = [0.5, 0.8], [0.6, -0.25], 0.1
        total = round(sum(x * w for x, w in zip(inputs, weights)) + bias, 8)
        print(json.dumps({'inputs': inputs, 'weights': weights, 'bias': bias, 'sum': total, 'relu': max(0, total)}, ensure_ascii=False))
        print('ReLU(z) = max(0, z) ; ici ReLU(0.2) = 0.2.')
        return 0
    raise RuntimeError('Erreur pédagogique volontaire : cet exemple montre stderr et un code de sortie non nul.')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
    sys.exit(main())
