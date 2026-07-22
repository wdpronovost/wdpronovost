import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('src/index.html', root), 'utf8');
const css = await readFile(new URL('src/css/site.css', root), 'utf8');
const js = await readFile(new URL('src/js/site.js', root), 'utf8');
const build = await readFile(new URL('scripts/build.mjs', root), 'utf8');
const nodeVersion = (await readFile(new URL('.nvmrc', root), 'utf8')).trim();

const modes = [
  ['leader', 'Director of Technology'],
  ['builder', 'Product Builder'],
  ['developer', 'Software Developer'],
  ['designer', 'Designer'],
  ['systems', 'Systems Thinker'],
  ['collaborator', 'Human–AI Collaborator']
];

const evidence = [
  'At Pendleton, I direct technology work',
  'Skalable, CeQR, Equa, and Tocin',
  'software work across Skalable, CeQR, Equa, Tocin, Storycraft, Elumri, and Proxidian',
  'KittyScapes and the product practices',
  'Storycraft, Elumri, and Proxidian',
  'WeTheAIs, Lumi, and Hermes'
];

test('Netlify uses a supported Node runtime', () => {
  const major = Number.parseInt(nodeVersion, 10);
  assert.ok(Number.isInteger(major) && major >= 20, `.nvmrc must select Node 20 or newer, received: ${nodeVersion}`);
});

test('production homepage truthfully identifies Billy and the practice', () => {
  assert.match(html, /<title>Billy Pronovost — Technology, Products, and Human–AI Practice<\/title>/);
  assert.match(html, /<meta name="description" content="Billy Pronovost builds small, useful systems with AI in the loop/);
  assert.match(html, /<h1[^>]*>Billy(?:<br>)?Pronovost/i);
  assert.match(html, /I build small, useful systems\s*<em>with AI in the loop\.<\/em>/);
  assert.match(html, /Director of Technology at Pendleton/);
  assert.match(html, /Things I'm making/);
  assert.match(html, /Lumi \/ Hermes/);
  assert.match(html, /changed files, passing checks, screenshots/);
  assert.doesNotMatch(html, /Back to design directions|The Signal Garden|Route the signal/i);
});

test('Modes of Practice is a six-mode semantic tab interaction with a meaningful initial state', () => {
  assert.match(html, /MODES OF PRACTICE \/ SELECT ONE/);
  assert.match(html, /role="tablist" aria-label="Modes of Practice"/);
  assert.match(html, /role="tablist"[^>]*aria-orientation="vertical"/);
  assert.match(html, /id="mode-panel" role="tabpanel"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
  for (const [key, label] of modes) {
    assert.match(html, new RegExp(`data-mode="${key}"`));
    assert.match(html, new RegExp(label.replace('–', '–')));
    assert.match(js, new RegExp(`${key}: \\{`));
  }
  assert.match(html, /id="tab-leader" role="tab" aria-selected="true"/);
  assert.match(html, /PUBLIC EVIDENCE \/ 01/);
  assert.match(js, /selectMode\(document\.querySelector/);
});

test('Explorations feed shows the work with interactive project demos', () => {
  assert.match(html, /id="explorations"/);
  assert.match(html, /data-reveal/);
  assert.match(html, /data-continuity-demo/);
  assert.match(html, /Skalable/);
  assert.match(html, /Lumi \/ Hermes/);
  assert.match(html, /REQUEST → CONTEXT → PATCH → PROOF/);
  assert.match(css, /continuity-demo/);
  assert.match(js, /data-continuity-step/);
  assert.match(js, /Start with the actual message/);
});

test('each mode has concrete public-safe evidence and visible connections', () => {
  for (const statement of evidence) assert.match(js, new RegExp(statement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(js, /related: \[['"]/);
  assert.match(js, /classList\.toggle\('is-connected'/);
  assert.match(html, /id="evidence-proof"/);
  assert.match(html, /<span>Works beside<\/span>/);
  assert.doesNotMatch(html + js, /\b(?:award-winning|world-class|best-in-class)\b/i);
});

test('mode selection updates evidence, accessible status, and named-work emphasis', () => {
  assert.match(js, /proof\.textContent = detail\.proof/);
  assert.match(js, /panel\.setAttribute\('aria-labelledby', tab\.id\)/);
  assert.match(js, /workNote\.innerHTML/);
  assert.match(js, /relatedNames\.join/);
  assert.match(js, /classList\.toggle\('is-related'/);
  assert.match(html, /id="work-note" role="status" aria-live="polite"/);
  for (const project of ['Skalable', 'CeQR', 'Equa', 'Tocin', 'Storycraft', 'Elumri', 'Proxidian', 'WeTheAIs', 'KittyScapes', 'Shared World Television']) {
    assert.match(html, new RegExp(project));
  }
});

test('pointer, keyboard, mobile, focus, and reduced-motion contracts exist', () => {
  assert.match(js, /addEventListener\('click'/);
  for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']) assert.match(js, new RegExp(key));
  assert.match(js, /event\.preventDefault\(\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /overflow-x:hidden/);
});

test('homepage stays local-only and avoids stale project exits', () => {
  assert.doesNotMatch(html, /<(?:script|link|img)[^>]+(?:src|href)="https?:\/\//i);
  assert.doesNotMatch(html, /<a[^>]+href="https?:\/\//i);
  assert.match(html, /mailto:wdp@wdpronovost\.com/);
  assert.match(html, /Names are included as an honest inventory/);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|fonts\.googleapis/i);
});

test('build maps deterministic production source paths and preserves directions', () => {
  for (const pair of [
    "['src/index.html', 'dist/index.html']",
    "['src/css/site.css', 'dist/css/site.css']",
    "['src/js/site.js', 'dist/js/site.js']",
    "['public/directions', 'dist/directions']"
  ]) assert.ok(build.includes(pair), `missing deterministic build mapping ${pair}`);
});
