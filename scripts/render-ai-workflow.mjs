import { mkdir, readFile, writeFile } from 'node:fs/promises';

const data = JSON.parse(await readFile('src/data/ai-workflow.json', 'utf8'));
const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
const list = (items) => items.map((item) => `<li>${esc(item)}</li>`).join('\n');
const workflowCards = data.workflow.map((step, index) => `
          <article class="flow-card${index === 0 ? ' is-active' : ''}" id="flow-${esc(step.id)}" data-flow-card="${esc(step.id)}" aria-labelledby="flow-${esc(step.id)}-title">
            <p class="flow-index">0${index + 1} / ${esc(step.label)}</p>
            <h3 id="flow-${esc(step.id)}-title">${esc(step.title)}</h3>
            <p>${esc(step.body)}</p>
          </article>`).join('\n');
const flowButtons = data.workflow.map((step, index) => `
            <button type="button" data-flow-step="${esc(step.id)}" aria-pressed="${index === 0 ? 'true' : 'false'}">
              <span>0${index + 1}</span>${esc(step.label)}
            </button>`).join('\n');
const guardrails = data.guardrails.map((item, index) => `
          <article>
            <span>0${index + 1}</span>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.body)}</p>
          </article>`).join('\n');

const workflowSvg = `
          <svg class="workflow-svg" viewBox="0 0 900 360" role="img" aria-labelledby="workflow-svg-title workflow-svg-desc">
            <title id="workflow-svg-title">Source to structure to review to publish workflow diagram</title>
            <desc id="workflow-svg-desc">Four labeled stages connected by lines, with review emphasized before publishing.</desc>
            <path class="flow-line" d="M145 180 C260 100 330 100 445 180 S630 260 755 180"/>
            <g class="flow-node flow-node-source" data-svg-node="source"><rect x="54" y="112" width="182" height="136" rx="18"/><text x="145" y="170">SOURCE</text><text x="145" y="198">inputs</text></g>
            <g class="flow-node flow-node-structure" data-svg-node="structure"><rect x="354" y="112" width="182" height="136" rx="18"/><text x="445" y="170">STRUCTURE</text><text x="445" y="198">draft</text></g>
            <g class="flow-node flow-node-review" data-svg-node="review"><circle cx="610" cy="180" r="72"/><text x="610" y="174">REVIEW</text><text x="610" y="202">human check</text></g>
            <g class="flow-node flow-node-publish" data-svg-node="publish"><rect x="704" y="112" width="154" height="136" rx="18"/><text x="781" y="170">PUBLISH</text><text x="781" y="198">approved</text></g>
          </svg>`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4ddb7">
  <meta name="description" content="${esc(data.meta.description)}">
  <title>${esc(data.meta.title)}</title>
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/css/site.css">
  <link rel="stylesheet" href="/css/ai-workflow.css">
  <script src="/js/ai-workflow.js" defer></script>
</head>
<body class="ai-case-page">
  <a class="skip" href="#main-content">Skip to main content</a>
  <header class="case-header">
    <a class="wordmark" href="/" aria-label="Billy Pronovost home">W<span>D</span>P</a>
    <p>AI workflow case study</p>
    <a href="/">Home</a>
  </header>
  <main id="main-content">
    <section class="case-hero" aria-labelledby="case-title">
      <div class="case-hero-copy">
        <p class="case-kicker">${esc(data.hero.kicker)}</p>
        <h1 id="case-title">${esc(data.hero.title)}</h1>
        <p class="case-statement">${esc(data.hero.statement)}</p>
        <div class="case-actions">
          <a class="case-button" href="/downloads/ai-workflow-case-study.pdf">Download PDF <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v12m-5-5 5 5 5-5M5 20h14"/></svg></a>
          <a class="case-link-button" href="#workflow">Explore workflow</a>
        </div>
      </div>
      <div class="case-hero-visual" aria-hidden="true">
        <div class="paper-stack">
          <span class="paper paper-one"></span>
          <span class="paper paper-two"></span>
          <span class="paper paper-three"></span>
        </div>
        <div class="report-card-mini"><b>Weekly report</b><span></span><span></span><span></span></div>
      </div>
    </section>

    <section class="case-proof-strip" aria-label="Case study proof points">
      ${data.hero.proofPoints.map((item, index) => `<p><span>0${index + 1}</span>${esc(item)}</p>`).join('\n      ')}
    </section>

    <section class="case-section workflow-section" id="workflow" aria-labelledby="workflow-title">
      <div class="case-section-head">
        <p>WORKFLOW / INTERACTIVE</p>
        <h2 id="workflow-title">Source material becomes a reviewed report.</h2>
      </div>
      <div class="workflow-board" data-flow-board>
        <div class="workflow-visual">
${workflowSvg}
          <div class="workflow-controls" role="group" aria-label="Step through the workflow">
${flowButtons}
          </div>
        </div>
        <div class="flow-card-stack" aria-live="polite">
${workflowCards}
        </div>
      </div>
    </section>

    <section class="case-section split-section" aria-labelledby="split-title">
      <div class="case-section-head">
        <p>OPERATING MODEL / HUMAN IN THE LOOP</p>
        <h2 id="split-title">AI does the synthesis. Billy decides what is true.</h2>
      </div>
      <div class="decision-split">
        <article>
          <p class="split-label-case">AI DOES</p>
          <ul>${list(data.split.ai)}</ul>
        </article>
        <article>
          <p class="split-label-case">BILLY DECIDES</p>
          <ul>${list(data.split.human)}</ul>
        </article>
      </div>
    </section>

    <section class="case-section mockup-section" aria-labelledby="mockup-title">
      <div class="case-section-head">
        <p>SANITIZED REPORT MOCKUP / NO SOURCE DATA</p>
        <h2 id="mockup-title">The page shows the shape of work, not private content.</h2>
      </div>
      <div class="mockup-composition">
        <div class="mock-source">
          <h3>Before synthesis</h3>
          ${data.mockup.before.map((item) => `<span>${esc(item)}</span>`).join('\n          ')}
        </div>
        <div class="mock-bridge" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="mock-report">
          <div class="mock-report-head"><span></span><span></span></div>
          <h3>Reviewed weekly report</h3>
          ${data.mockup.after.map((item) => `<p>${esc(item)}</p>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="case-section guardrail-section" aria-labelledby="guardrail-title">
      <div class="case-section-head">
        <p>CONTROLS / BOUNDARIES</p>
        <h2 id="guardrail-title">Speed is useful only when the guardrails are explicit.</h2>
      </div>
      <div class="guardrail-grid">
${guardrails}
      </div>
    </section>

    <section class="case-section experiment-section" aria-labelledby="experiment-title">
      <div>
        <p class="case-kicker">LATEST EXPERIMENT / PERSISTENT AI PARTNER</p>
        <h2 id="experiment-title">${esc(data.experiment.title)}</h2>
        <p>${esc(data.experiment.body)}</p>
      </div>
      <ol class="experiment-steps">
        ${data.experiment.steps.map((item, index) => `<li><span>0${index + 1}</span>${esc(item)}</li>`).join('\n        ')}
      </ol>
    </section>

    <section class="case-cta" aria-labelledby="cta-title">
      <p class="case-kicker">DOWNLOADABLE CASE STUDY / PDF READY</p>
      <h2 id="cta-title">A self-contained PDF is available for upload.</h2>
      <p>The PDF includes the same sanitized story and vector diagrams for offline review. The public page adds interactivity, but the PDF does not depend on the site.</p>
      <div class="case-actions">
        <a class="case-button" href="/downloads/ai-workflow-case-study.pdf">Download case-study PDF <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v12m-5-5 5 5 5-5M5 20h14"/></svg></a>
        <a class="case-link-button" href="/#contact">Contact</a>
      </div>
      <p class="public-url">${esc(data.meta.publicUrl)}</p>
    </section>
  </main>
  <footer>
    <span>WDP</span>
    <a href="/">Home <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M7 17 17 7M7 7h10v10"/></svg></a>
    <span>AI workflow case study</span>
  </footer>
</body>
</html>
`;

const printHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(data.meta.title)} PDF</title>
  <link rel="stylesheet" href="../css/ai-workflow-print.css">
</head>
<body>
  <main>
    <section class="pdf-page cover">
      <p class="kicker">Current-role AI workflow / Human in the loop</p>
      <h1>${esc(data.hero.title)}</h1>
      <p class="statement">${esc(data.hero.statement)}</p>
      <div class="cover-diagram" aria-hidden="true"><span>Sources</span><span>Draft</span><span>Review</span><span>Approved report</span></div>
      <p class="url">${esc(data.meta.publicUrl)}</p>
    </section>
    <section class="pdf-page workflow">
      <p class="kicker">Current-role AI workflow</p>
      <h2>How the reporting workflow operates</h2>
      <div class="pdf-flow">
        ${data.workflow.map((step, index) => `<article><span>0${index + 1}</span><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p></article>`).join('\n        ')}
      </div>
      <div class="pdf-split"><div><h3>AI does</h3><ul>${list(data.split.ai)}</ul></div><div><h3>Billy decides</h3><ul>${list(data.split.human)}</ul></div></div>
    </section>
    <section class="pdf-page controls">
      <p class="kicker">Controls and latest experiment</p>
      <h2>Bounded synthesis, verified output, human authority</h2>
      <div class="pdf-guardrails">${guardrails}</div>
      <div class="experiment-box"><h3>${esc(data.experiment.title)}</h3><p>${esc(data.experiment.body)}</p><ol>${data.experiment.steps.map((item) => `<li>${esc(item)}</li>`).join('')}</ol></div>
      <p class="note">Sanitized case study: no confidential names, ticket keys, source data, screenshots, credentials, internal systems, or private memory contents.</p>
    </section>
  </main>
</body>
</html>
`;
await mkdir('src/ai-workflow', { recursive: true });
await writeFile('src/ai-workflow/index.html', html, 'utf8');
await writeFile('src/ai-workflow/print.html', printHtml, 'utf8');
