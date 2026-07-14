import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('src/index.html', root), 'utf8');
const css = await readFile(new URL('src/css/site.css', root), 'utf8');
const js = await readFile(new URL('src/js/site.js', root), 'utf8');

const scenes = ['workshop', 'council', 'station', 'control', 'archive', 'mailbox'];

test('V2 presents a kinetic world with six semantic interactive scenes', () => {
  assert.match(html, /<title>The Signal Garden<\/title>/);
  assert.match(html, /Route the signal/);
  for (const scene of scenes) {
    assert.match(html, new RegExp(`id="${scene}"`));
    assert.match(html, new RegExp(`data-scene="${scene}"`));
  }
});

test('signal arrival is a real state transition with an accessible status', () => {
  assert.match(html, /id="route-signal"/);
  assert.match(html, /id="world-status"[^>]*role="status"/);
  assert.match(js, /world\.classList\.add\('is-live'\)/);
  assert.match(js, /signalRouted = true/);
});

test('artifact workshop exposes public-safe projects as working pieces, not cards', () => {
  for (const project of ['Elumri', 'Equa', 'Ceqr', 'Tocin', 'Storycraft']) assert.match(html, new RegExp(project));
  assert.match(html, /data-piece=/);
  assert.match(js, /machine\.dataset\.build/);
});

test('council, station, and control room provide distinct input mechanisms', () => {
  assert.match(html, /id="council-balance"[^>]*type="range"/);
  assert.match(html, /name="council-choice"/);
  assert.match(html, /id="station-dial"[^>]*type="range"/);
  assert.match(html, /data-route-node/);
  assert.match(js, /updateCouncil/);
  assert.match(js, /updateStation/);
  assert.match(js, /routeNodes/);
});

test('identity is evidence-first and detail is progressive', () => {
  assert.match(html, /id="keeper"[^>]*hidden[^>]*inert/);
  assert.match(html, /data-inspect/);
  assert.match(html, /id="inspect-dialog"[^>]*hidden/);
  assert.match(js, /visited\.size < 2/);
  assert.match(js, /keeper\.hidden = false/);
});

test('complete route index is subtle, semantic, and accessible', () => {
  assert.match(html, /<details class="route-index"/);
  for (const scene of scenes) assert.match(html, new RegExp(`href="#${scene}"`));
  assert.doesNotMatch(html, /class="(?:case|card|project-card)\b/);
});

test('contact and source exits are truthful', () => {
  assert.match(html, /mailto:wdp@wdpronovost\.com/);
  assert.match(html, /https:\/\/github\.com\/wdpronovost/);
  assert.match(html, /Director of Technology at Pendleton/);
  assert.match(html, /labor-union communications/);
});

test('mobile, focus, hidden state, and reduced motion protections exist', () => {
  assert.match(css, /\[hidden\]\{display:none!important\}/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /overflow-x:hidden/);
});

test('dialog supports escape, focus containment, and focus restoration', () => {
  assert.match(js, /event\.key === 'Escape'/);
  assert.match(js, /event\.key !== 'Tab'/);
  assert.match(js, /inspectReturnFocus\?\.focus\(\)/);
  assert.match(html, /role="dialog"[^>]*aria-modal="true"/);
});

test('production resources are local and the intentional mailbox is explicit', () => {
  assert.doesNotMatch(html, /<(?:script|link|img)[^>]+(?:src|href)="https?:\/\//i);
  assert.match(html, /mailto:wdp@wdpronovost\.com/);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|fonts\.googleapis/i);
});
