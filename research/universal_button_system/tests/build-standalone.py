"""Bundle only the project-owned three-context source for offline file review.

This does not render or test a browser. CSP permits exact authored inline bytes
by hash, while service connections, fonts, frames and external code stay blocked.
"""
from pathlib import Path
import base64
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'specimens'
css = '\n'.join((SOURCE / name).read_text() for name in ['tokens.css', 'families.css', 'contexts.css'])
modules = ['semantics.mjs', 'components/actions.mjs', 'components/selection.mjs', 'render.mjs']
js = '\n'.join(re.sub(r'^import[^\n]*\n', '', (SOURCE / name).read_text(), flags=re.M).replace('export ', '') for name in modules)
js = '(function(){\n' + js + '\n})();'
digest = lambda value: base64.b64encode(hashlib.sha256(value.encode()).digest()).decode()
csp = f"default-src 'none'; connect-src 'none'; img-src data:; style-src 'sha256-{digest(css)}'; script-src 'sha256-{digest(js)}'; font-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'"
html = (SOURCE / 'index.html').read_text()
html = re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]+>', f'<meta http-equiv="Content-Security-Policy" content="{csp}">', html)
html = re.sub(r'<link rel="stylesheet"[^>]+>', '', html)
html = html.replace('</head>', '<style>' + css + '</style></head>')
html = html.replace('<script type="module" src="render.mjs"></script>', '<script>' + js + '</script>')
html = html.replace('Original specimens · local simulation · no network actions', 'Unrendered source candidate · local simulation · no network actions')
html = html.replace('href="golf.html"', 'href="../specimens/golf.html"')
dest = ROOT / 'delivery' / 'Button-lab-source-candidate.html'
dest.parent.mkdir(exist_ok=True)
dest.write_text(html)
print(f'Bundled authored HTML source: {len(html.encode())} bytes; browser not run')
