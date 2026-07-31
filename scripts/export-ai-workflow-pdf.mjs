import { cp, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const run = promisify(execFile);
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const packetDir = "/Users/billy/Library/Mobile Documents/iCloud~md~obsidian/Documents/Lumi's Lab/Career/Applications/Airtable — Delivery Consultant";
const webPdf = resolve('public/downloads/ai-workflow-case-study.pdf');
const packetPdf = `${packetDir}/airtable-ai-workflow-case-study.pdf`;
await mkdir('public/downloads', { recursive: true });
await run('node', ['scripts/render-ai-workflow.mjs']);
const fileUrl = pathToFileURL(resolve('src/ai-workflow/print.html')).href;
await run(chrome, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${webPdf}`,
  fileUrl
], { timeout: 120000 });
await cp(webPdf, packetPdf);
console.log(`Exported ${webPdf}`);
console.log(`Copied ${packetPdf}`);
