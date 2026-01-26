const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const resultFile = path.join(__dirname, 'find_unused_result.json');
const archiveRoot = path.join(repoRoot, 'archive', 'unreferenced');

if (!fs.existsSync(resultFile)) {
  console.error('Missing analysis result:', resultFile);
  process.exit(1);
}

const buf = fs.readFileSync(resultFile);
let raw;
// handle UTF-8 BOM (0xEF,0xBB,0xBF)
if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  raw = buf.slice(3).toString('utf8');
} else if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
  // UTF-16 LE BOM - fall back to toString with 'utf16le'
  raw = buf.toString('utf16le');
} else {
  raw = buf.toString('utf8');
}
// In case of stray control characters before the JSON, find first '{'
const firstBrace = raw.indexOf('{');
if (firstBrace > 0) raw = raw.slice(firstBrace);
const data = JSON.parse(raw);
const files = data.unreferencedFiles || [];

for (const f of files) {
  const rel = path.relative(path.join(repoRoot, 'src'), f);
  const dest = path.join(archiveRoot, 'src', rel);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  try {
    fs.copyFileSync(f, dest);
    console.log('COPIED', f, '->', dest);
  } catch (err) {
    console.error('FAILED', f, err.message);
  }
}

console.log('Archive complete.');
