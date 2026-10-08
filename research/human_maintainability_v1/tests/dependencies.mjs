import { readFile, readdir } from 'node:fs/promises';

// This is a bounded source check for this plain ESM package, not a JS parser.
// Reject unsupported import forms rather than pretending to analyze them.
export const allowedImports = {
  'app.mjs': ['platform.mjs', 'application.mjs'],
  'application.mjs': ['state.mjs', 'focus.mjs', 'view.mjs', 'controllers.mjs'],
  'view.mjs': ['state.mjs', 'assets.mjs'],
  'controllers.mjs': [],
  'platform.mjs': ['state.mjs'],
  'assets.mjs': [],
  'state.mjs': [],
  'focus.mjs': []
};

export function dependencyViolations(name, source) {
  const violations = [];
  if (!Object.hasOwn(allowedImports, name)) return ['Unmapped runtime module: ' + name];
  const imports = [...source.matchAll(/^import\s+[^;]+?\s+from\s+['"]([^'"]+)['"];?$/gm)];
  const remaining = imports.reduce((text, match) => text.replace(match[0], ''), source);
  if (/\bimport\s*(?:\(|['"]|\{|\*|[A-Za-z_$])|\bexport\s+[^;]*\bfrom\s*['"]/.test(remaining)) {
    violations.push('Unsupported import/re-export form');
  }
  for (const [, target] of imports) {
    if (!target.startsWith('./') || !allowedImports[name].includes(target.slice(2))) {
      violations.push(`${name} -> ${target} is prohibited`);
    }
  }
  const pure = ['state.mjs', 'focus.mjs', 'assets.mjs'];
  const sourceWithoutComments = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  if (pure.includes(name) && /\b(document|window|fetch|localStorage|addEventListener)\b/.test(sourceWithoutComments)) {
    violations.push('Pure role accesses a browser capability');
  }
  if (name === 'controllers.mjs' && /\b(transition|createState|viewModel|fetch|localStorage)\b/.test(sourceWithoutComments)) {
    violations.push('Controller owns rules or persistence');
  }
  if (name === 'view.mjs' && /\b(transition|createState|fetch|localStorage|addEventListener)\b/.test(sourceWithoutComments)) {
    violations.push('View owns rules, loading, or input');
  }
  return violations;
}

export async function checkDependencies(directory) {
  const violations = [];
  for (const name of await readdir(directory)) {
    if (!name.endsWith('.mjs')) continue;
    const source = await readFile(new URL(name, directory), 'utf8');
    violations.push(...dependencyViolations(name, source));
  }
  return violations;
}
