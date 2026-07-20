import { cp, mkdir, rm } from 'node:fs/promises';

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

console.log(`Built ${copies.length} production files into a clean dist/ directory.`);
