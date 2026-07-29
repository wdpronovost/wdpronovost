import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const routeNames = ['warm-studio', 'field-notes', 'product-lab', 'billy'];
const routes = Object.fromEntries(await Promise.all(routeNames.map(async (name) => [
  name,
  {
    html: await readFile(new URL(`public/directions/${name}/index.html`, root), 'utf8'),
    css: await readFile(new URL(`public/directions/${name}/site.css`, root), 'utf8'),
    js: await readFile(new URL(`public/directions/${name}/site.js`, root), 'utf8')
  }
])));
const selector = await readFile(new URL('public/directions/index.html', root), 'utf8');
const selectorCss = await readFile(new URL('public/directions/site.css', root), 'utf8');
const build = await readFile(new URL('scripts/build.mjs', root), 'utf8');

const allHtml = [selector, ...Object.values(routes).map((route) => route.html)];
const allCss = [selectorCss, ...Object.values(routes).map((route) => route.css)];

test('directions selector links to four comparison routes', () => {
  assert.match(selector, /<title>Four Directions — Billy Pronovost<\/title>/);
  for (const route of routeNames) assert.match(selector, new RegExp(`href="\\/directions\\/${route}\\/"`));
});

test('each direction has a unique title, identity, projects, about treatment, and interaction hook', () => {
  const titles = new Set();
  for (const [name, { html }] of Object.entries(routes)) {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title, `${name} needs a title`);
    titles.add(title);
    assert.match(html, /Billy Pronovost/);
    assert.match(html, /Director of Technology at Pendleton/);
    assert.match(html, /(?:Lumi|Hermes)/);
    assert.match(html, /WeTheAIs/);
    assert.match(html, /(?:Equa|Ceqr|Tocin|Storycraft|Elumri)/);
    assert.match(html, /<section[^>]+(?:id|class)="[^"]*about/i);
    assert.match(html, /data-interaction=/);
    assert.match(html, /href="site\.css"/);
    assert.match(html, /src="site\.js"/);
  }
  assert.equal(titles.size, 4, 'titles should distinguish all four directions');
});

test('pages use only local assets and include accessibility/mobile protections', () => {
  for (const html of allHtml) {
    assert.match(html, /<main\b/);
    assert.doesNotMatch(html, /<(?:script|link|img)[^>]+(?:src|href)=["']https?:\/\//i);
    assert.doesNotMatch(html, /fonts\.googleapis|googletagmanager|google-analytics/i);
  }
  for (const css of allCss) {
    assert.match(css, /:focus-visible/);
    assert.match(css, /min-height:\s*44px/);
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
    assert.match(css, /overflow-x:\s*hidden/);
  }
});

test('interactions expose semantic state and live feedback', () => {
  assert.match(routes['warm-studio'].html, /aria-pressed=/);
  assert.match(routes['warm-studio'].html, /role="status"/);
  assert.match(routes['field-notes'].html, /role="tablist"/);
  assert.match(routes['field-notes'].html, /role="tabpanel"/);
  assert.match(routes['product-lab'].html, /type="range"/);
  assert.match(routes['product-lab'].html, /aria-live="polite"/);
  assert.match(routes.billy.html, /role="tablist"/);
  assert.match(routes.billy.html, /role="tabpanel"/);
  assert.match(routes.billy.html, /aria-selected="true"/);
  assert.match(routes.billy.html, /data-mode="(?:leader|builder|developer|designer|systems|collaborator)"/);
  assert.match(routes.billy.html, /Skalable/);
  assert.match(routes.billy.html, /Shared World Television/);
  assert.match(routes.billy.html, /communications[\s\S]*design[\s\S]*software[\s\S]*technology leadership[\s\S]*human–AI experimentation/i);
  for (const { js } of Object.values(routes)) assert.match(js, /addEventListener/);
});

test('Billy direction is a truthful, local, mode-driven homepage candidate', () => {
  const { html, css, js } = routes.billy;
  assert.match(html, /<h1[^>]*>Billy(?:<br>)?Pronovost/i);
  assert.match(html, /I build technology\s*<em>around people\.<\/em>/);
  assert.match(html, /Director of Technology/);
  assert.match(html, /Product Builder/);
  assert.match(html, /Human–AI Collaborator/);
  assert.doesNotMatch(html, /href="https?:\/\//i);
  assert.doesNotMatch(html, /\b(?:finished|polished|award-winning|world-class)\b/i);
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.match(js, /ArrowRight|ArrowDown/);
  assert.match(js, /aria-selected/);
});

test('build copies public directions deterministically and routes reach dist', async () => {
  assert.match(build, /public\/directions/);
  for (const route of routeNames) {
    await access(new URL(`dist/directions/${route}/index.html`, root));
    await access(new URL(`dist/directions/${route}/site.css`, root));
    await access(new URL(`dist/directions/${route}/site.js`, root));
  }
});
