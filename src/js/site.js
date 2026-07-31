const modes = {
  leader: {
    number: '01',
    title: 'Make the work legible.',
    copy: 'Turn competing needs into a direction people can understand, question, and carry forward together.',
    proof: 'At Pendleton, I direct technology work while translating between people, priorities, and the systems that support them.',
    connection: 'Systems Thinker + Product Builder',
    related: ['systems', 'builder'],
    label: 'technology leadership'
  },
  builder: {
    number: '02',
    title: 'Give the idea a useful shape.',
    copy: 'Find the smallest honest version of a product that can teach us something—and make it real enough to use.',
    proof: 'Skalable, CeQR, Equa, and Tocin are named product practices where I explore bounded jobs, useful shape, and working software.',
    connection: 'Designer + Software Developer',
    related: ['designer', 'developer'],
    label: 'product building'
  },
  developer: {
    number: '03',
    title: 'Close the distance to working.',
    copy: 'Write the code, test the behavior, and stay near enough to the person using it to notice what the spec missed.',
    proof: 'The public inventory names software work across Skalable, CeQR, Equa, Tocin, Storycraft, Elumri, and Proxidian.',
    connection: 'Product Builder + Systems Thinker',
    related: ['builder', 'systems'],
    label: 'software development'
  },
  designer: {
    number: '04',
    title: 'Make the next step feel natural.',
    copy: 'Use language, hierarchy, and interaction to help people understand where they are and what they can do.',
    proof: 'KittyScapes and the product practices in this inventory give me places to work directly with interface, language, and interaction.',
    connection: 'Product Builder + Human–AI Collaborator',
    related: ['builder', 'collaborator'],
    label: 'design'
  },
  systems: {
    number: '05',
    title: 'Notice what the parts do together.',
    copy: 'Trace decisions across tools, teams, and time so the whole system supports the people inside it.',
    proof: 'Storycraft, Elumri, and Proxidian are ongoing explorations of connected technical, narrative, and continuity systems.',
    connection: 'Director of Technology + Software Developer',
    related: ['leader', 'developer'],
    label: 'systems thinking'
  },
  collaborator: {
    number: '06',
    title: 'Keep the person in the loop.',
    copy: 'Work with AI as a capable collaborator while preserving judgment, context, authorship, and human agency.',
    proof: 'WeTheAIs, Lumi, and Hermes are named parts of my ongoing public human–AI practice—not claims of finished products.',
    connection: 'Systems Thinker + Designer',
    related: ['systems', 'designer'],
    label: 'human–AI collaboration'
  }
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.querySelector('#mode-panel');
const title = document.querySelector('#evidence-title');
const copy = document.querySelector('#evidence-copy');
const proof = document.querySelector('#evidence-proof');
const evidenceLabel = document.querySelector('#evidence-label');
const connection = document.querySelector('#evidence-connection');
const workNote = document.querySelector('#work-note');
const projects = [...document.querySelectorAll('[data-modes]')];

function selectMode(tab, moveFocus = false) {
  const mode = tab.dataset.mode;
  const detail = modes[mode];
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    item.classList.toggle('is-connected', detail.related.includes(item.dataset.mode));
  });
  panel.setAttribute('aria-labelledby', tab.id);
  title.textContent = detail.title;
  copy.textContent = detail.copy;
  proof.textContent = detail.proof;
  evidenceLabel.textContent = `PUBLIC EVIDENCE / ${detail.number}`;
  connection.innerHTML = `<span>Works beside</span> ${detail.connection}`;
  const relatedProjects = projects.filter((project) => project.dataset.modes.split(' ').includes(mode));
  const relatedNames = relatedProjects.map((project) => project.querySelector('.project-name').textContent);
  if (workNote) {
    workNote.innerHTML = `Showing ${relatedProjects.length} named works connected to <strong>${detail.label}</strong>: ${relatedNames.join(', ')}.`;
  }
  projects.forEach((project) => project.classList.toggle('is-related', relatedProjects.includes(project)));
  document.body.dataset.mode = mode;
  if (moveFocus) tab.focus();
}

function moveTab(event, tab) {
  const index = tabs.indexOf(tab);
  let nextIndex = null;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabs.length - 1;
  if (nextIndex === null) return;
  event.preventDefault();
  selectMode(tabs[nextIndex], true);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => selectMode(tab));
  tab.addEventListener('keydown', (event) => moveTab(event, tab));
});

selectMode(document.querySelector('[role="tab"][aria-selected="true"]'));

/* ---- Explorations: before/after reveal sliders ---- */
document.querySelectorAll('[data-reveal]').forEach((reveal) => {
  const range = reveal.querySelector('.reveal-range');
  const beforeWrap = reveal.querySelector('.reveal-before-wrap');
  const beforeImg = reveal.querySelector('.reveal-before');
  const handle = reveal.querySelector('.reveal-handle');

  function syncWidth() {
    // Pin the inner "before" image to the card's full width so both logos map 1:1.
    beforeImg.style.setProperty('--card-w', reveal.clientWidth + 'px');
  }
  function paint(value) {
    // Clamp the visual so the round handle never clips off the card edges.
    const v = Math.max(0, Math.min(100, Number(value)));
    const clamped = Math.max(3, Math.min(97, v));
    beforeWrap.style.width = v + '%';
    handle.style.left = clamped + '%';
  }

  range.addEventListener('input', () => paint(range.value));
  window.addEventListener('resize', syncWidth);
  syncWidth();
  paint(range.value);
});

/* ---- WDP easter egg: AI signal trace ---- */
(() => {
  const trigger = document.querySelector('[data-ai-trace-trigger]');
  const dialog = document.querySelector('[data-ai-trace]');
  const closeButton = document.querySelector('[data-ai-trace-close]');
  if (!trigger || !dialog || !closeButton) return;

  let clickCount = 0;
  let clickTimer = null;
  let pendingNavigation = null;
  let lastFocus = null;
  let pageSiblings = [];

  function setPageInert(enabled) {
    if (!pageSiblings.length) {
      pageSiblings = [...document.body.children].filter((child) => child !== dialog);
    }
    pageSiblings.forEach((child) => {
      if (enabled) child.setAttribute('inert', '');
      else child.removeAttribute('inert');
    });
  }

  function getFocusable() {
    return [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => !el.hasAttribute('disabled') && !el.closest('[hidden]'));
  }

  function openTrace() {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    setPageInert(true);
    document.body.classList.add('trace-open');
    closeButton.focus();
  }

  function closeTrace() {
    dialog.hidden = true;
    setPageInert(false);
    document.body.classList.remove('trace-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function followWordmarkLink() {
    const target = trigger.getAttribute('href');
    if (!target) return;
    if (target.startsWith('#')) {
      document.querySelector(target)?.scrollIntoView();
      history.replaceState(null, '', target);
      return;
    }
    window.location.href = target;
  }

  function countLogoClick(event) {
    event.preventDefault();
    clickCount += 1;
    clearTimeout(clickTimer);
    clearTimeout(pendingNavigation);
    if (clickCount >= 3) {
      clickCount = 0;
      openTrace();
      return;
    }
    clickTimer = setTimeout(() => { clickCount = 0; }, 900);
    pendingNavigation = setTimeout(() => {
      if (clickCount === 1) followWordmarkLink();
      clickCount = 0;
    }, 340);
  }

  trigger.addEventListener('click', countLogoClick);
  trigger.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.shiftKey) {
      event.preventDefault();
      openTrace();
    }
  });
  closeButton.addEventListener('click', closeTrace);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeTrace();
  });
  document.addEventListener('keydown', (event) => {
    if (dialog.hidden) return;
    if (event.key === 'Escape') {
      closeTrace();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();


/* ---- Explorations: continuity system mini demo ---- */
(() => {
  const demo = document.querySelector('[data-continuity-demo]');
  if (!demo) return;
  const title = demo.querySelector('[data-continuity-title]');
  const copy = demo.querySelector('[data-continuity-copy]');
  const buttons = [...demo.querySelectorAll('[data-continuity-step]')];
  const steps = {
    request: ['Start with the actual message.', '“You aren’t actually doing anything with the site” becomes a concrete target: make a visible card, not another plan.'],
    context: ['Pull in the real context.', 'The site brief, repo state, and prior design rules shape the next edit before any code changes.'],
    patch: ['Change the source files.', 'HTML, CSS, JS, and tests are patched in the wdpronovost.com repo — the artifact is the site itself.'],
    proof: ['Prove it happened.', 'Build, tests, lint, and screenshots verify the card before it gets considered for the live branch.']
  };
  function setStep(step) {
    const [heading, body] = steps[step];
    demo.dataset.active = step;
    title.textContent = heading;
    copy.textContent = body;
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.continuityStep === step)));
  }
  buttons.forEach((button) => button.addEventListener('click', () => setStep(button.dataset.continuityStep)));
  setStep('request');
})();


/* ---- Build Log: filter the site's own change history ---- */
(() => {
  const shell = document.querySelector('.log-shell');
  if (!shell) return;
  const chips = [...shell.querySelectorAll('[data-log-filter]')];
  const entries = [...shell.querySelectorAll('.log-entry')];
  const status = shell.querySelector('[data-log-status]');
  if (!chips.length || !entries.length) return;

  const labels = { all: 'changes', exploration: 'explorations', feature: 'features', fix: 'fixes' };

  function applyFilter(filter) {
    let shown = 0;
    entries.forEach((entry) => {
      const match = filter === 'all' || entry.dataset.logType === filter;
      entry.hidden = !match;
      if (match) shown += 1;
    });
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.logFilter === filter)));
    if (status) {
      const noun = labels[filter] || 'changes';
      status.textContent = `Showing ${shown} ${shown === 1 ? noun.replace(/s$/, '') : noun}.`;
    }
  }

  chips.forEach((chip) => chip.addEventListener('click', () => applyFilter(chip.dataset.logFilter)));
  applyFilter('all');
})();

/* ---- Bench cards: play each vignette once in view, replay on hover/tap ---- */
(() => {
  const cards = [...document.querySelectorAll('.bench-card')];
  if (!cards.length) return;

  function play(card) {
    card.classList.remove('is-live');
    void card.offsetWidth; // reflow so the animation can restart
    card.classList.add('is-live');
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.played) {
          entry.target.dataset.played = '1';
          play(entry.target);
        }
      });
    }, { threshold: 0.45 });
    cards.forEach((card) => io.observe(card));
  } else {
    cards.forEach((card) => card.classList.add('is-live'));
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => play(card));
    card.addEventListener('click', () => play(card));
  });
})();

/* ---- The Lab: pick-one method demo ---- */
(() => {
  const demo = document.querySelector('[data-lab-demo]');
  if (!demo) return;
  const opts = [...demo.querySelectorAll('[data-lab-opt]')];
  const out = demo.querySelector('[data-lab-out]');
  if (!opts.length || !out) return;

  const COPY = {
    hard: 'You picked <b>the hard shadow</b>. Confident, a little retro-print — it matches the rest of this page. That preference is now a fact I can build on.',
    soft: 'You picked <b>the soft lift</b>. Calmer and more modern — it would pull the whole site in a softer direction. Noted, and the AI adapts.'
  };

  opts.forEach((opt) => {
    opt.addEventListener('click', () => {
      opts.forEach((o) => o.setAttribute('aria-pressed', String(o === opt)));
      out.innerHTML = COPY[opt.dataset.labOpt] || '';
    });
  });
})();

/* ---- Equa: income-based fair split demo ---- */
(() => {
  const demo = document.querySelector('[data-split-demo]');
  if (!demo) return;

  const BILL = 2400;
  const inputs = {
    a: demo.querySelector('[data-split-input="a"]'),
    b: demo.querySelector('[data-split-input="b"]')
  };
  if (!inputs.a || !inputs.b) return;

  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

  function render() {
    const a = Number(inputs.a.value);
    const b = Number(inputs.b.value);
    const total = a + b;
    const shareA = total > 0 ? a / total : 0.5;
    const shareB = 1 - shareA;
    const pctA = Math.round(shareA * 100);
    const pctB = 100 - pctA;
    const payA = BILL * shareA;
    const payB = BILL - payA;

    demo.querySelector('[data-split-out="a"]').textContent = money(a);
    demo.querySelector('[data-split-out="b"]').textContent = money(b);
    demo.querySelector('[data-split-pct="a"]').textContent = pctA + '%';
    demo.querySelector('[data-split-pct="b"]').textContent = pctB + '%';
    demo.querySelector('[data-split-seg="a"]').style.flexGrow = String(Math.max(shareA, 0.001));
    demo.querySelector('[data-split-seg="b"]').style.flexGrow = String(Math.max(shareB, 0.001));
    demo.querySelector('[data-split-amt="a"]').textContent = money(payA);
    demo.querySelector('[data-split-amt="b"]').textContent = money(payB);

    const half = BILL / 2;
    const gap = Math.abs(half - payA);
    const compare = demo.querySelector('[data-split-compare]');
    if (gap < 1) {
      compare.innerHTML = 'Equal incomes, so the fair split <b>is</b> 50/50 — the app just stops you having to check.';
    } else {
      const behind = payA < half ? 'Partner A' : 'Partner B';
      compare.innerHTML = `Split 50/50 instead and ${behind} pays <b>${money(gap)}</b> more than their income share.`;
    }
  }

  Object.values(inputs).forEach((input) => input.addEventListener('input', render));
  render();
})();

/* ---- Quiet ledger + weighted reveal treatment ---- */
(() => {
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealGroups = [...document.querySelectorAll('.reveal-group')];
  revealGroups.forEach((group) => {
    [...group.children].forEach((child, index) => child.style.setProperty('--stagger', String(Math.min(index, 8))));
    if (reduceMotion) group.classList.add('is-visible');
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
      // A ratio threshold can NEVER be satisfied by an element taller than the
      // viewport (a 6000px section on a 844px phone maxes out around 0.14), which
      // would leave that content stuck at opacity:0 forever. Trigger on any
      // intersection instead and let rootMargin do the timing.
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    revealGroups.forEach((group) => revealObserver.observe(group));

    // Belt-and-braces: never let content stay invisible. If anything is still
    // hidden shortly after load, reveal it outright.
    window.setTimeout(() => {
      revealGroups.forEach((group) => group.classList.add('is-visible'));
    }, 2500);
  } else {
    revealGroups.forEach((group) => group.classList.add('is-visible'));
  }

  const ledger = document.querySelector('[data-ledger]');
  const ledgerSections = [...document.querySelectorAll('[data-ledger-section]')];
  if (!ledger || !ledgerSections.length) return;
  const links = [...ledger.querySelectorAll('[data-ledger-link]')];

  function setActive(id) {
    links.forEach((link) => link.classList.toggle('is-active', link.dataset.ledgerLink === id));
  }

  if ('IntersectionObserver' in window) {
    const visible = new Map();
    const ledgerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      });
      const active = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      if (active) setActive(active);
    }, { rootMargin: '-18% 0px -58% 0px', threshold: [0.05, 0.18, 0.32, 0.5, 0.7] });
    ledgerSections.forEach((section) => ledgerObserver.observe(section));
  }
})();

/* ---- Contact: progressively enhance Netlify Forms without exposing an email address ---- */
(() => {
  const form = document.querySelector('[data-contact-form]');
  const status = form?.querySelector('[data-contact-status]');
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.hidden = false;
    status.classList.remove('is-error');
    status.textContent = 'Sending…';

    try {
      const body = new URLSearchParams(new FormData(form));
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      if (!response.ok) throw new Error(`Contact form returned ${response.status}`);
      form.reset();
      status.textContent = 'Message sent. I’ll get back to you soon.';
    } catch {
      status.classList.add('is-error');
      status.textContent = 'That didn’t send. Please try again in a moment.';
    } finally {
      button.disabled = false;
    }
  });
})();

/* ---- Working with me: rotating review themes ---- */
(() => {
  const root = document.querySelector('[data-voices]');
  if (!root) return;
  const cards = [...root.querySelectorAll('[data-voice-card]')];
  const dots = [...root.querySelectorAll('[data-voice-dot]')];
  if (!cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DWELL = 7000;
  let index = 0;
  let timer = null;
  let auto = !reduced;

  function show(next) {
    index = (next + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const on = i === index;
      card.hidden = !on;
      card.classList.toggle('is-active', on);
    });
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('is-on', on);
      dot.setAttribute('aria-selected', String(on));
    });
  }

  function stop() {
    auto = false;
    if (timer) { clearInterval(timer); timer = null; }
  }

  function start() {
    if (!auto || timer) return;
    timer = setInterval(() => show(index + 1), DWELL);
  }

  root.querySelector('[data-voice-next]')?.addEventListener('click', () => { stop(); show(index + 1); });
  root.querySelector('[data-voice-prev]')?.addEventListener('click', () => { stop(); show(index - 1); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stop(); show(i); }));

  root.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    stop();
    show(index + (event.key === 'ArrowRight' ? 1 : -1));
  });

  root.addEventListener('mouseenter', () => { if (timer) { clearInterval(timer); timer = null; } });
  root.addEventListener('mouseleave', start);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { entry.isIntersecting ? start() : (timer && (clearInterval(timer), timer = null)); });
    }, { threshold: 0 });
    io.observe(root);
  } else {
    start();
  }

  show(0);
})();
