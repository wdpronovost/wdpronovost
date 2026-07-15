import { cp, mkdir, rm } from 'node:fs/promises';

const copies = [
  ['src/index.html', 'dist/index.html'],
  ['src/css/site.css', 'dist/css/site.css'],
  ['src/js/site.js', 'dist/js/site.js'],
  ['public/favicon.ico', 'dist/favicon.ico'],
  ['public/_redirects', 'dist/_redirects'],
  ['public/directions', 'dist/directions']
];

await rm('dist', { recursive: true, force: true });
await Promise.all([
  mkdir('dist/css', { recursive: true }),
  mkdir('dist/js', { recursive: true })
]);
await Promise.all(copies.map(([source, target]) => cp(source, target, { recursive: source === 'public/directions' })));

console.log(`Built ${copies.length} production files into a clean dist/ directory.`);
