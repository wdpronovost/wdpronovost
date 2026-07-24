import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

const copies = [
  ['src/index.html', 'dist/index.html'],
  ['src/css/site.css', 'dist/css/site.css'],
  ['src/js/site.js', 'dist/js/site.js'],
  ['public/favicon.ico', 'dist/favicon.ico'],
  ['public/_redirects', 'dist/_redirects'],
  ['public/directions', 'dist/directions'],
  ['public/img', 'dist/img']
];

await rm('dist', { recursive: true, force: true });
await Promise.all([
  mkdir('dist/css', { recursive: true }),
  mkdir('dist/js', { recursive: true })
]);
const recursiveSources = new Set(['public/directions', 'public/img']);
await Promise.all(copies.map(([source, target]) => cp(source, target, { recursive: recursiveSources.has(source) })));

/* ---- Build Log: render the site's own evolution from git history ---- */
// Privacy: only short hash, date, and subject are read — never author name or email.
const escapeHtml = (value) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
// Defensive scrub: strip anything that looks like an email or a private key marker.
const scrub = (value) => value
  .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '')
  .replace(/BEGIN[ A-Z]*PRIVATE KEY/gi, '')
  .trim();

function classify(subject) {
  const lower = subject.toLowerCase();
  // Conventional-commit prefix wins first so `fix(explorations): ...` reads as a Fix.
  if (/^fix\b/.test(lower)) return { type: 'fix', label: 'Fix' };
  if (/^(?:feat|feature)\b/.test(lower)) {
    if (/(exploration|card|slider|reveal|trace|demo|build log|buildlog)/.test(lower)) {
      return { type: 'exploration', label: 'Exploration' };
    }
    return { type: 'feature', label: 'Feature' };
  }
  if (/(exploration|card|slider|reveal|signal trace|demo)/.test(lower)) {
    return { type: 'exploration', label: 'Exploration' };
  }
  return { type: 'update', label: 'Update' };
}

function cleanSubject(subject) {
  // Drop the conventional-commit prefix for a human-readable line, then sentence-case it.
  let text = scrub(subject).replace(/^(?:feat|fix|chore|refactor|docs|style|test|perf)(?:\([^)]*\))?:\s*/i, '');
  text = text.replace(/^add\b/i, 'Added').replace(/^launch\b/i, 'Launched').replace(/^expand\b/i, 'Expanded');
  if (text.length) text = text.charAt(0).toUpperCase() + text.slice(1);
  return text;
}

async function collectBuildLog() {
  // Netlify performs shallow clones, so git history may be unavailable at deploy
  // time. Read git when we can, and fall back to the committed snapshot so the
  // section always renders the real record in production.
  const snapshotPath = 'src/data/buildlog.json';
  let fromGit = [];
  try {
    const { stdout } = await run('git', [
      'log', '--pretty=format:%h\u0001%ad\u0001%s', '--date=short', '-n', '60'
    ], { cwd: process.cwd() });
    fromGit = stdout.split('\n')
      .map((line) => line.split('\u0001'))
      .filter((parts) => parts.length === 3)
      .map(([hash, date, subject]) => ({ hash: hash.trim(), date: date.trim(), subject: scrub(subject) }))
      // The current site is the 2026 redesign; earlier history is a different, retired site.
      .filter((entry) => entry.date >= '2026-01-01' && entry.subject.length > 0);
  } catch {
    fromGit = [];
  }

  let snapshot = [];
  try {
    snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
    if (!Array.isArray(snapshot)) snapshot = [];
  } catch {
    snapshot = [];
  }

  // A deep local checkout is the source of truth; refresh the snapshot from it.
  if (fromGit.length >= snapshot.length && fromGit.length > 0) {
    await mkdir('src/data', { recursive: true });
    await writeFile(snapshotPath, `${JSON.stringify(fromGit, null, 2)}\n`, 'utf8');
    return fromGit;
  }
  return snapshot;
}

const rawLog = await collectBuildLog();
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${monthNames[m - 1]} ${d}, ${y}`;
}

const entriesHtml = rawLog.map((entry) => {
  const { type, label } = classify(entry.subject);
  const title = escapeHtml(cleanSubject(entry.subject));
  return `        <li class="log-entry" data-log-type="${type}">
          <time class="log-date" datetime="${escapeHtml(entry.date)}">${escapeHtml(prettyDate(entry.date))}</time>
          <span class="log-type log-type-${type}">${label}</span>
          <p class="log-title">${title}</p>
          <span class="log-hash" aria-hidden="true">${escapeHtml(entry.hash)}</span>
        </li>`;
}).join('\n');

const logCount = String(rawLog.length);
const logUpdated = rawLog.length ? prettyDate(rawLog[0].date) : '—';
const fallback = `        <li class="log-entry" data-log-type="update">
          <p class="log-title">The build log renders from git history at build time.</p>
        </li>`;

let html = await readFile('dist/index.html', 'utf8');
html = html
  .replace('<!--BUILDLOG_ENTRIES-->', entriesHtml || fallback)
  .replace('<!--BUILDLOG_COUNT-->', logCount)
  .replace('<!--BUILDLOG_UPDATED-->', escapeHtml(logUpdated));
await writeFile('dist/index.html', html, 'utf8');

console.log(`Built ${copies.length} production files and rendered ${rawLog.length} build-log entries into a clean dist/ directory.`);
