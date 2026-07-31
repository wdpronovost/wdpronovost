import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('src/index.html', root), 'utf8');
const css = await readFile(new URL('src/css/site.css', root), 'utf8');
const js = await readFile(new URL('src/js/site.js', root), 'utf8');
const build = await readFile(new URL('scripts/build.mjs', root), 'utf8');
const labHtml = await readFile(new URL('public/lab/index.html', root), 'utf8');
const labJs = await readFile(new URL('public/lab/lab.js', root), 'utf8');
const labCss = await readFile(new URL('public/lab/lab.css', root), 'utf8');
const aiData = JSON.parse(await readFile(new URL('src/data/ai-workflow.json', root), 'utf8'));
const aiHtml = await readFile(new URL('src/ai-workflow/index.html', root), 'utf8');
const aiCss = await readFile(new URL('src/css/ai-workflow.css', root), 'utf8');
const aiJs = await readFile(new URL('src/js/ai-workflow.js', root), 'utf8');
const aiPrintHtml = await readFile(new URL('src/ai-workflow/print.html', root), 'utf8');
const aiPrintCss = await readFile(new URL('src/css/ai-workflow-print.css', root), 'utf8');
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
  assert.match(html, /Nothing here is/);
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
  assert.match(html, /REQUEST \/ CONTEXT \/ PATCH \/ PROOF/);
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

test('mode selection updates evidence and the three built-out examples are present', () => {
  assert.match(js, /proof\.textContent = detail\.proof/);
  assert.match(js, /panel\.setAttribute\('aria-labelledby', tab\.id\)/);
  for (const id of ['exp-skalable', 'exp-equa', 'exp-lumi', 'exp-lab']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const project of ['Skalable', 'Equa', 'CeQR', 'Storycraft', 'Elumri', 'Tocin']) {
    assert.match(html, new RegExp(project));
  }
  assert.doesNotMatch(html, /A LIVING INVENTORY|One throughline/);
});

test('Equa fair-split demo is interactive and computes from income', () => {
  assert.match(html, /data-split-demo/);
  for (const hook of ['data-split-input="a"', 'data-split-input="b"', 'data-split-amt="a"', 'data-split-pct="a"', 'data-split-compare']) {
    assert.ok(html.includes(hook), `missing split demo hook ${hook}`);
  }
  assert.match(html, /type="range"[^>]*data-split-input/);
  assert.match(js, /const shareA = total > 0 \? a \/ total : 0\.5/);
  assert.match(js, /addEventListener\('input', render\)/);
  assert.match(css, /\.split-bar\{display:flex/);
  // Facts must match the prelaunch product, no invented pricing or live-domain claim on this page.
  assert.match(html, /One-time purchase/);
  assert.match(html, /In prelaunch validation/);
  assert.match(html, /STATUS · Prelaunch/);
  assert.doesNotMatch(html, /getequa\.com|APP · SHIPPED|STATUS · Shipped/);
  assert.doesNotMatch(html, /\$\d+\.\d\d/);
});

test('The Lab card showcases the method and links to the live picker', () => {
  assert.match(html, /id="exp-lab"/);
  assert.match(html, /data-lab-demo/);
  assert.match(html, /data-lab-opt="hard"/);
  assert.match(html, /data-lab-opt="soft"/);
  assert.match(html, /href="\/lab\/"/);
  assert.match(js, /aria-pressed', String\(o === opt\)/);
  assert.match(css, /\.lab-demo\{display:flex/);
  // The Lab must be the LAST exploration card: it explains how the others were made.
  assert.ok(html.indexOf('id="exp-lab"') > html.indexOf('id="exp-lumi"'), 'Lab card should close the section');
});

test('The linked Lab is a public-ready working artifact, not an internal handoff', () => {
  assert.match(labHtml, /OPEN DESIGN LAB/);
  assert.match(labHtml, /working instrument behind wdpronovost\.com/i);
  assert.match(labHtml, /working code/i);
  assert.doesNotMatch(labHtml, /noindex|nofollow|internal · not indexed|send this back to me/i);
  assert.match(labHtml, /data-reset/);
});

test('The Lab restores saved choices and can reset the complete local workflow', () => {
  assert.match(labJs, /const STORAGE_KEY = 'wdp-design-lab-v1'/);
  assert.match(labJs, /localStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(labJs, /localStorage\.setItem\(STORAGE_KEY/);
  assert.match(labJs, /localStorage\.removeItem\(STORAGE_KEY\)/);
  assert.match(labJs, /resultText\.value = ''/);
  assert.match(labJs, /data-reset/);
  assert.match(labJs, /restoreSavedState\(\)/);
  assert.match(labJs, /setAttribute\('aria-pressed'/);
  assert.match(labCss, /\.result-actions/);
  assert.match(labCss, /\.reset/);
});

test('bench cards carry live vignettes, not just prose', () => {
  for (const key of ['ceqr', 'storycraft', 'elumri', 'tocin']) {
    assert.match(html, new RegExp(`data-bench="${key}"`));
  }
  assert.match(html, /class="bench-viz"/);
  // Each vignette must depict the product's actual function.
  assert.match(html, /ceqr-ticket/);
  assert.match(html, /story-revise/);
  assert.match(html, /elumri-trace/);
  assert.match(html, /tocin-orbit/);
  assert.match(js, /entry\.target\.dataset\.played/);
  assert.match(css, /\.bench-card\.is-live/);
  // Decorative vignettes must be hidden from screen readers.
  assert.match(html, /class="bench-viz" aria-hidden="true"/);
  // Motion must be disableable.
  assert.match(css, /prefers-reduced-motion:reduce\)\{\s*\.bench-card/);
});

test('reveal animation can never strand tall sections at opacity:0', () => {
  // A ratio threshold is unsatisfiable for an element taller than the viewport.
  // The Explorations section is several thousand px tall on a phone, so the
  // reveal observer must trigger on ANY intersection (threshold 0).
  const observerCall = /rootMargin:\s*'[^']*',\s*threshold:\s*0\s*\}/.exec(js);
  assert.ok(observerCall, 'reveal observer must use threshold: 0, not a ratio');
  assert.doesNotMatch(js, /threshold:\s*0\.12/);
  // And there must be an unconditional fallback that reveals content regardless.
  assert.match(js, /setTimeout\(\(\) => \{\s*revealGroups\.forEach/);
  // Non-JS and reduced-motion users must always see content.
  assert.match(css, /\.reveal-group>\*\{opacity:1/);
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

test('sticky section nav and weighted reveals render in built homepage', async () => {
  const dist = await readFile(new URL('dist/index.html', root), 'utf8');
  for (const [id, label] of [
    ['explorations', 'Explorations'],
    ['buildlog', 'Build Log'],
    ['work', 'Work'],
    ['about', 'About']
  ]) {
    assert.match(dist, new RegExp(`href="#${id}"[^>]*data-ledger-link="${id}"[^>]*>[\\s\\S]*${label}`));
    assert.match(dist, new RegExp(`id="${id}"[^>]*data-ledger-section`));
  }
  assert.match(dist, /class="section-nav" aria-label="Page sections" data-ledger/);
  assert.doesNotMatch(dist, /page-ledger/);
  assert.match(dist, /class="hero reveal-group"/);
  assert.match(dist, /class="exp-card reveal-group" id="exp-skalable"/);
  assert.match(css, /\.js \.reveal-group>\*/);
  assert.match(css, /cubic-bezier\(\.16,1,\.3,1\)/);
  assert.match(css, /\.section-nav\{position:sticky/);
  assert.match(css, /\.section-nav ol\{[^}]*flex:1[^}]*min-width:0/);
  assert.doesNotMatch(css, /\.page-ledger\{position:fixed/);
  assert.match(css, /prefers-reduced-motion:reduce\)\{\.js \.reveal-group>\*/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /data-ledger-section/);
  assert.match(js, /classList\.add\('is-visible'\)/);
});

test('homepage stays local-only, uses the protected contact form, and avoids stale project exits', () => {
  assert.doesNotMatch(html, /<(?:script|link|img)[^>]+(?:src|href)="https?:\/\//i);
  assert.doesNotMatch(html, /<a[^>]+href="https?:\/\//i);
  assert.match(html, /<form[^>]+name="contact"[^>]+data-netlify="true"[^>]+netlify-honeypot="company-website"/);
  assert.match(html, /name="form-name" value="contact"/);
  assert.match(html, /data-contact-status/);
  assert.match(js, /new URLSearchParams\(new FormData\(form\)\)/);
  assert.match(js, /Content-Type': 'application\/x-www-form-urlencoded'/);
  assert.doesNotMatch(html, /mailto:|wdp@wdpronovost\.com/i);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|fonts\.googleapis/i);
});

test('build maps deterministic production source paths and preserves directions', () => {
  for (const pair of [
    "['src/index.html', 'dist/index.html']",
    "['src/css/site.css', 'dist/css/site.css']",
    "['src/js/site.js', 'dist/js/site.js']",
    "['src/ai-workflow/index.html', 'dist/ai-workflow/index.html']",
    "['src/css/ai-workflow.css', 'dist/css/ai-workflow.css']",
    "['src/js/ai-workflow.js', 'dist/js/ai-workflow.js']",
    "['public/downloads', 'dist/downloads']",
    "['public/directions', 'dist/directions']"
  ]) assert.ok(build.includes(pair), `missing deterministic build mapping ${pair}`);
});

test('Lumi card links to the dedicated AI workflow case study without changing its core story', () => {
  assert.match(html, /id="exp-lumi"/);
  assert.match(html, /href="\/ai-workflow\/">OPEN AI WORKFLOW CASE STUDY/);
  assert.match(html, /A local AI partner that can pick up context, edit the real site, and prove the work happened/);
});

test('AI workflow route is generated from shared data and contains required visual case-study sections', async () => {
  const distAi = await readFile(new URL('dist/ai-workflow/index.html', root), 'utf8');
  for (const required of [
    'AI-assisted reporting with human approval.',
    'Team recap submissions',
    'live Jira queries',
    'AI does the synthesis. Billy decides what is true.',
    'SANITIZED REPORT MOCKUP / NO SOURCE DATA',
    'Speed is useful only when the guardrails are explicit.',
    'Latest experiment: Lumi / Hermes',
    'wdpronovost.com/ai-workflow/'
  ]) {
    assert.match(aiHtml, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(distAi, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(aiHtml, /data-flow-board/);
  assert.match(aiHtml, /workflow-svg/);
  assert.match(aiHtml, /data-flow-step="source"/);
  assert.match(aiHtml, /data-flow-step="publish"/);
  assert.match(aiCss, /\.mockup-composition/);
  assert.match(aiCss, /min-height:48px/);
  assert.match(aiCss, /prefers-reduced-motion:reduce/);
  assert.match(aiJs, /ArrowRight/);
  assert.match(aiJs, /aria-pressed/);
});

test('AI workflow public route and PDF source stay sanitized and local-only', () => {
  const combined = `${aiHtml}\n${aiData.answer}\n${aiPrintHtml}`;
  assert.doesNotMatch(combined, /Airtable|Greenhouse|8654173002/i);
  assert.doesNotMatch(combined, /[A-Z]+-\d{2,}/);
  assert.doesNotMatch(combined, /\b(?:ticket key|internal IP|credential|password|secret key)\b/i);
  assert.doesNotMatch(combined, /<(?:script|link|img)[^>]+(?:src|href)="https?:\/\//i);
  assert.doesNotMatch(combined, /<a[^>]+href="https?:\/\//i);
  assert.doesNotMatch(combined, /\b(?:award-winning|best-in-class|world-class)\b/i);
});

test('AI workflow print/PDF source is self-contained and exactly three pages', () => {
  assert.match(aiPrintHtml, /ai-workflow-print\.css/);
  assert.match(aiPrintCss, /@page\{size:letter/);
  assert.match(aiPrintCss, /page-break-after:always/);
  assert.equal((aiPrintHtml.match(/class="pdf-page/g) || []).length, 3);
  for (const required of ['Current-role AI workflow', 'AI does', 'Billy decides', 'Controls and latest experiment']) {
    assert.match(aiPrintHtml, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('Build Log renders the site history from git without leaking identity', async () => {
  const dist = await readFile(new URL('dist/index.html', root), 'utf8');
  // Section scaffolding and interaction hooks exist in source.
  assert.match(html, /id="buildlog"/);
  assert.match(html, /BUILD LOG \/ THIS SITE, EVOLVING IN PUBLIC/);
  assert.match(html, /data-log-filter="all"/);
  assert.match(css, /\.log-entry/);
  assert.match(js, /data-log-filter/);
  assert.match(js, /applyFilter/);
  // Build injects real entries and resolves every placeholder.
  assert.match(dist, /class="log-entry" data-log-type="/);
  assert.doesNotMatch(dist, /<!--BUILDLOG_(?:ENTRIES|COUNT|UPDATED)-->/);
  // Privacy: no author emails or key markers reach the rendered page.
  assert.doesNotMatch(dist, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  assert.match(build, /never author name or email/);
});
