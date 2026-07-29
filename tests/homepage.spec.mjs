import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('src/index.html', root), 'utf8');
const css = await readFile(new URL('src/css/site.css', root), 'utf8');
const js = await readFile(new URL('src/js/site.js', root), 'utf8');
const build = await readFile(new URL('scripts/build.mjs', root), 'utf8');
const verify = await readFile(new URL('scripts/verify.mjs', root), 'utf8');
const netlify = await readFile(new URL('netlify.toml', root), 'utf8');
const labHtml = await readFile(new URL('public/lab/index.html', root), 'utf8');
const labJs = await readFile(new URL('public/lab/lab.js', root), 'utf8');
const labCss = await readFile(new URL('public/lab/lab.css', root), 'utf8');
const dist = await readFile(new URL('dist/index.html', root), 'utf8');
const nodeVersion = (await readFile(new URL('.nvmrc', root), 'utf8')).trim();

async function collectText(relative) {
  const base = new URL(relative, root);
  const paths = [];
  async function walk(directoryUrl) {
    for (const entry of await readdir(directoryUrl, { withFileTypes: true })) {
      const entryUrl = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directoryUrl);
      if (entry.isDirectory()) await walk(entryUrl);
      else if (/\.(?:html|css|js|mjs|md|json|toml)$/i.test(entry.name)) paths.push(entryUrl);
    }
  }
  await walk(base);
  return (await Promise.all(paths.map((path) => readFile(path, 'utf8')))).join('\n');
}

const publicSource = [
  await collectText('src/'),
  await collectText('public/'),
  await collectText('prototypes/'),
  await readFile(new URL('README.md', root), 'utf8')
].join('\n');

test('Netlify uses a supported Node runtime', () => {
  const major = Number.parseInt(nodeVersion, 10);
  assert.ok(Number.isInteger(major) && major >= 20);
});

test('production homepage is an inviting AI-career portfolio rather than a blog or card wall', () => {
  assert.match(html, /AVAILABLE FOR REMOTE AI, PRODUCT, AND TECHNOLOGY LEADERSHIP ROLES/);
  assert.match(html, /Technology leader\. Product builder\. Human–AI practitioner\./);
  assert.match(html, /data-visitor-path/);
  assert.match(html, /What are you here to evaluate\?/);
  assert.match(html, /data-work-stage/);
  assert.match(html, /data-command-dialog/);
  assert.match(html, /Open navigator/);
  assert.match(html, /class="portrait-window"/);
  assert.match(html, /src="\/img\/billy-pronovost\.jpg"/);
  assert.match(js, /event\.metaKey \|\| event\.ctrlKey/);
  assert.match(js, /\[data-work-trigger\]/);
  assert.doesNotMatch(html, /<article[^>]+class="exp-card/);
  assert.doesNotMatch(html, /blog|latest posts|newsletter/i);
});

test('homepage truthfully identifies Billy and his practice', () => {
  assert.match(html, /<title>Billy Pronovost — Technology, Products, and Human–AI Practice<\/title>/);
  assert.match(html, /Director of Technology at Pendleton/);
  assert.match(html, /Lumi \/ Hermes/);
  assert.match(html, /Skalable/);
  assert.match(html, /Equa/);
  assert.match(html, /In prelaunch validation/);
  assert.doesNotMatch(html + js, /\b(?:award-winning|world-class|best-in-class|millions of users)\b/i);
});

test('evaluation paths are accessible tabs with concrete evidence', () => {
  assert.match(html, /role="tablist" aria-label="Choose an evaluation path"/);
  for (const path of ['ai', 'product', 'leadership', 'judgment']) {
    assert.match(html, new RegExp(`data-path="${path}"`));
    assert.match(js, new RegExp(`${path}: \\{`));
  }
  assert.match(html, /id="path-answer" role="tabpanel"[^>]+aria-live="polite"/);
  assert.match(js, /setupRovingTabs/);
  for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']) assert.match(js, new RegExp(key));
});

test('selected work uses one switchable stage instead of repeated project cards', () => {
  for (const key of ['skalable', 'equa', 'lumi']) {
    assert.match(html, new RegExp(`data-work-trigger="${key}"`));
    assert.match(html, new RegExp(`data-work-panel="${key}"`));
  }
  assert.match(js, /panel\.hidden = panel\.dataset\.workPanel !== key/);
  assert.match(css, /\.work-stage\{/);
  assert.match(css, /\.work-switcher\{/);
});

test('Skalable comparison is a real keyboard-operable range interaction', () => {
  assert.match(html, /data-reveal/);
  assert.match(html, /type="range"[^>]+aria-label="Compare the raster and vector versions"/);
  assert.match(html, /skalable-before\.png/);
  assert.match(html, /skalable-after\.png/);
  assert.match(js, /beforeWrap\.style\.width/);
  assert.match(css, /\.reveal:focus-within/);
});

test('Equa demo computes income-based shares and remains prelaunch', () => {
  for (const hook of ['data-split-input="a"', 'data-split-input="b"', 'data-split-amt="a"', 'data-split-pct="a"', 'data-split-compare']) {
    assert.ok(html.includes(hook), `missing Equa hook ${hook}`);
  }
  assert.match(js, /incomeA \/ \(incomeA \+ incomeB\)/);
  assert.match(js, /addEventListener\('input', render\)/);
  assert.match(html, /In prelaunch validation/);
  assert.doesNotMatch(html, /STATUS · Shipped|APP · SHIPPED|getequa\.com/);
});

test('Lumi and Hermes demo exposes the request-to-proof workflow', () => {
  assert.match(html, /data-continuity-demo/);
  for (const step of ['request', 'context', 'change', 'proof']) assert.match(html, new RegExp(`data-continuity-step="${step}"`));
  assert.match(js, /Return evidence, not confidence/);
  assert.match(html, /tests, browser evidence, and human approval/i);
});

test('navigator works from a visible control and keyboard shortcut', () => {
  assert.match(html, /data-command-open/);
  assert.match(html, /<dialog[^>]+data-command-dialog/);
  assert.match(js, /showModal\(\)/);
  assert.match(js, /event\.key\.toLowerCase\(\) === 'k'/);
  assert.match(html, /data-command-close/);
  assert.match(css, /\.command-dialog::backdrop/);
});

test('contact is private, host-native, accessible, and has live submission feedback', () => {
  assert.doesNotMatch(publicSource, /mailto:|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i);
  assert.match(html, /<form[^>]+name="contact"[^>]+method="POST"[^>]+data-netlify="true"/);
  assert.match(html, /netlify-honeypot="company-website"/);
  for (const field of ['name', 'email', 'message']) assert.match(html, new RegExp(`name="${field}"`));
  assert.match(html, /data-contact-status/);
  assert.match(js, /new URLSearchParams/);
  assert.match(js, /button\.disabled = true/);
  assert.match(js, /response\.ok/);
  assert.match(js, /did not send/);
  assert.match(netlify, /form-action 'self'/);
  assert.doesNotMatch(netlify, /form-action 'none'/);
});

test('production UI contains no emoji or Unicode pseudo-icon arrows', () => {
  const productionText = `${html}\n${css}\n${js}\n${labHtml}\n${labCss}\n${labJs}`;
  assert.doesNotMatch(productionText, /[←→↑↓↗↔⇆✦✓×●★☆✨🚀🤖💡]/u);
});

test('homepage has local runtime assets and only the deliberate GitHub exit', () => {
  assert.doesNotMatch(html, /<(?:script|link|img)[^>]+(?:src|href)="https?:\/\//i);
  const exits = [...html.matchAll(/<a[^>]+href="(https?:\/\/[^"#]+)"/g)].map((match) => match[1]);
  assert.deepEqual(exits, ['https://github.com/wdpronovost']);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|fonts\.googleapis|use\.typekit/i);
});

test('the linked Lab is public-ready, persistent, and resettable', () => {
  assert.match(labHtml, /OPEN DESIGN LAB/);
  assert.match(labHtml, /working instrument behind wdpronovost\.com/i);
  assert.doesNotMatch(labHtml, /noindex|nofollow|internal · not indexed|send this back to me/i);
  assert.match(labJs, /const STORAGE_KEY = 'wdp-design-lab-v1'/);
  assert.match(labJs, /localStorage\.setItem/);
  assert.match(labJs, /localStorage\.removeItem/);
  assert.match(labHtml, /data-reset/);
  assert.match(labCss, /\.reset/);
});

test('secondary projects are compact rows with truthful states', () => {
  for (const project of ['CeQR', 'Elumri', 'Storycraft', 'Tocin']) assert.match(html, new RegExp(project));
  assert.match(html, /A working bench, not a trophy shelf/);
  assert.match(css, /\.inventory li\{display:grid/);
  assert.doesNotMatch(html, /class="bench-card"/);
});

test('responsive, focus, touch, and reduced-motion contracts exist', () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /overflow-x:hidden/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /scroll-snap-type:x mandatory/);
});

test('build emits only the production homepage, public Lab, and local assets', () => {
  for (const pair of [
    "['src/index.html', 'dist/index.html']",
    "['src/css/site.css', 'dist/css/site.css']",
    "['src/js/site.js', 'dist/js/site.js']",
    "['public/lab/index.html', 'dist/lab/index.html']",
    "['public/img', 'dist/img']"
  ]) assert.ok(build.includes(pair), `missing build mapping ${pair}`);
  assert.doesNotMatch(build, /\['public\/directions', 'dist\/directions'\]/);
});

test('build log renders recent repository history without identity leakage', () => {
  assert.match(dist, /class="log-entry" data-log-type="/);
  assert.doesNotMatch(dist, /<!--BUILDLOG_(?:ENTRIES|COUNT|UPDATED)-->/);
  assert.doesNotMatch(dist, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  assert.match(build, /never author name or email/);
  assert.match(css, /\.log-entry:nth-child\(n\+9\)\{display:none\}/);
});

test('verification script enforces privacy, contact transport, and dependency policy', () => {
  assert.match(verify, /private email address or mail link/);
  assert.match(verify, /host-native contact form/);
  assert.match(verify, /contact form spam protection/);
  assert.match(verify, /remote runtime asset/);
});
