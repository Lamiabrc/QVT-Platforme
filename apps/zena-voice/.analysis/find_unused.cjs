const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const exts = ['.ts', '.tsx', '.js', '.jsx'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files = files.concat(walk(full));
    } else if (e.isFile() && exts.includes(path.extname(full))) {
      files.push(full);
    }
  }
  return files;
}

function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch(e){ return ''; }
}

function parseImports(content) {
  const imports = new Set();
  const re1 = /import\s+(?:[\s\S]+?)\s+from\s+['\"]([^'\"]+)['\"]/g;
  const re2 = /require\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const re3 = /import\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  let m;
  while ((m = re1.exec(content))) imports.add(m[1]);
  while ((m = re2.exec(content))) imports.add(m[1]);
  while ((m = re3.exec(content))) imports.add(m[1]);
  return Array.from(imports);
}

function resolveSpecifier(fromFile, spec) {
  if (spec.startsWith('@/')) {
    const rel = spec.slice(2);
    const candidate = path.join(root, rel);
    // if spec already contains an extension, check the candidate as-is
    if (path.extname(candidate)) {
      if (fs.existsSync(candidate)) return path.normalize(candidate);
    }
    for (const ext of exts) {
      if (fs.existsSync(candidate + ext)) return path.normalize(candidate + ext);
    }
    // index
    for (const ext of exts) {
      if (fs.existsSync(path.join(candidate, 'index' + ext))) return path.normalize(path.join(candidate, 'index' + ext));
    }
    return null;
  }
  if (spec.startsWith('.') ) {
    const base = path.dirname(fromFile);
    const candidate = path.resolve(base, spec);
    // if spec already contains extension, check the candidate as-is
    if (path.extname(candidate)) {
      if (fs.existsSync(candidate)) return path.normalize(candidate);
    }
    for (const ext of exts) {
      if (fs.existsSync(candidate + ext)) return path.normalize(candidate + ext);
    }
    for (const ext of exts) {
      if (fs.existsSync(path.join(candidate, 'index' + ext))) return path.normalize(path.join(candidate, 'index' + ext));
    }
    return null;
  }
  // external module (node_modules) - ignore
  return 'external';
}

const files = walk(root);
const importMap = new Map(); // file -> [resolved file paths or 'external' or null]
const allResolvedImports = new Set();

for (const f of files) {
  const content = read(f);
  const specs = parseImports(content);
  const resolved = [];
  for (const s of specs) {
    const r = resolveSpecifier(f, s);
    resolved.push({ spec: s, resolved: r });
    if (r && r !== 'external') allResolvedImports.add(path.normalize(r));
  }
  importMap.set(path.normalize(f), resolved);
}

// Missing imports: imports that resolved to null
const missing = [];
for (const [f, arr] of importMap.entries()) {
  for (const it of arr) {
    if (it.resolved === null) {
      missing.push({ from: f, spec: it.spec });
    }
  }
}

// Unreferenced files: files that are not the target of any resolved import and are not entry points (index.tsx, main.tsx, App.tsx)
const referenced = new Set(allResolvedImports);
// Add known entry points
const entryCandidates = ['index.tsx','main.tsx','App.tsx'];
for (const f of files) {
  const bn = path.basename(f);
  if (entryCandidates.includes(bn)) referenced.add(path.normalize(f));
}

const unreferenced = [];
for (const f of files) {
  const nf = path.normalize(f);
  // ignore test files and stories and __tests__
  if (nf.includes('__tests__') || nf.endsWith('.test.ts') || nf.endsWith('.test.tsx')) continue;
  if (!referenced.has(nf)) {
    unreferenced.push(nf);
  }
}

const out = { missingImports: missing, unreferencedFiles: unreferenced };
console.log(JSON.stringify(out, null, 2));
