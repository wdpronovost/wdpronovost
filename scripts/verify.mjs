import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(path));
    else if (/\.(?:html|css|js|json|txt|xml|toml)$/i.test(entry.name)) files.push(path);
  }
  return files;
}

const files = [...await collect('src'), ...await collect('dist'), ...await collect('public/lab')];
const text = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
const failures = [];
const forbidden = [
  ['telephone number or link', /tel:|\b\d{3}[-.)\s]+\d{3}[-.\s]+\d{4}\b/i],
  ['external analytics or font dependency', /googletagmanager|google-analytics|fonts\.googleapis|use\.typekit/i],
  ['remote runtime asset', /<(?:script|link|img)[^>]+(?:src|href)=["']https?:\/\//i],
  ['public email address or mail link', /mailto:|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i],
  ['emoji-presenting UI symbol', /[↗↘↙↖→←↑↓⇆✦✓×]/],
  ['embedded private key', /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/i],
  ['obvious credential token', /(?:gh[pousr]_|github_pat_|sk-|xox[bap]-|AKIA)[A-Za-z0-9_-]{12,}/]
];
for (const [label, pattern] of forbidden) if (pattern.test(text)) failures.push(label);
// The site ships a strict CSP (style-src 'self'), so a static style="..." attribute is
// blocked at runtime and silently breaks the element. Use a class or a CSS rule instead.
const inlineStyle = /<[^>]+\sstyle=["'][^"']+["']/i.exec(text);
if (inlineStyle) failures.push(`inline style attribute violates CSP: ${inlineStyle[0].slice(0, 80)}`);
if (!/<main id="main-content"/.test(text)) failures.push('main landmark');
if (!/role="tablist"[^>]*aria-label="Modes of Practice"/.test(text)) failures.push('Modes of Practice tablist semantics');
if (!/role="tabpanel"[^>]*aria-live="polite"/.test(text)) failures.push('Modes of Practice live panel semantics');
if (!/prefers-reduced-motion:reduce/.test(text)) failures.push('reduced-motion protection');
if (!/<form[^>]+name="contact"[^>]+data-netlify="true"/.test(text)) failures.push('Netlify contact form');
if (!/netlify-honeypot="company-website"/.test(text)) failures.push('contact honeypot');
if (failures.length) throw new Error(`Verification failed: ${failures.join(', ')}`);
console.log(`Verified ${files.length} source and public text assets: landmarks, interaction hooks, contact intent, secret patterns, and dependency policy passed.`);
