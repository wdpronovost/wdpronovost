const pathContent = {
  ai: {
    label: 'AI SYSTEMS / PROOF',
    title: 'AI should leave useful evidence behind.',
    copy: 'Lumi and Hermes carry context into real work: changed files, passing checks, screenshots, and decisions a person can inspect.',
    href: '#work-lumi',
    link: 'Open the AI workflow'
  },
  product: {
    label: 'PRODUCT BUILDING / PROOF',
    title: 'A useful version teaches more than a polished promise.',
    copy: 'Skalable, Equa, CeQR, and Tocin turn bounded human problems into software people can operate and question.',
    href: '#work',
    link: 'Use selected products'
  },
  leadership: {
    label: 'TECHNOLOGY LEADERSHIP / PROOF',
    title: 'Make the work legible enough to move together.',
    copy: 'At Pendleton, Billy directs technology work while translating between people, priorities, risk, and the systems that support them.',
    href: '#about',
    link: 'See the operating perspective'
  },
  judgment: {
    label: 'HUMAN JUDGMENT / PROOF',
    title: 'Capability expands. Accountability stays visible.',
    copy: 'The practice uses AI for leverage while preserving human direction, authorship, verification, and consequential decisions.',
    href: '#practice',
    link: 'See how the practice works'
  }
};

function setupRovingTabs(buttons, select) {
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === null) return;
      event.preventDefault();
      select(buttons[next]);
      buttons[next].focus();
    });
  });
}

(() => {
  const shell = document.querySelector('[data-visitor-path]');
  if (!shell) return;
  const buttons = [...shell.querySelectorAll('[data-path]')];
  const panel = shell.querySelector('[role="tabpanel"]');
  const label = shell.querySelector('[data-path-label]');
  const title = shell.querySelector('[data-path-title]');
  const copy = shell.querySelector('[data-path-copy]');
  const link = shell.querySelector('[data-path-link]');

  function select(button) {
    const content = pathContent[button.dataset.path];
    buttons.forEach((item) => {
      const active = item === button;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', button.id);
    label.textContent = content.label;
    title.textContent = content.title;
    copy.textContent = content.copy;
    link.href = content.href;
    link.textContent = content.link;
  }

  setupRovingTabs(buttons, select);
})();

(() => {
  const stage = document.querySelector('[data-work-stage]');
  if (!stage) return;
  const buttons = [...stage.querySelectorAll('[data-work-trigger]')];
  const panels = [...stage.querySelectorAll('[data-work-panel]')];

  function select(button) {
    const key = button.dataset.workTrigger;
    buttons.forEach((item) => {
      const active = item === button;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.workPanel !== key; });
  }

  setupRovingTabs(buttons, select);
})();

document.querySelectorAll('[data-reveal]').forEach((reveal) => {
  const range = reveal.querySelector('.reveal-range');
  const beforeWrap = reveal.querySelector('.reveal-before-wrap');
  const beforeImage = reveal.querySelector('.reveal-before');
  const handle = reveal.querySelector('.reveal-handle');
  if (!range || !beforeWrap || !beforeImage || !handle) return;

  function syncWidth() {
    beforeImage.style.setProperty('--card-w', `${reveal.clientWidth}px`);
  }
  function paint() {
    const value = Math.max(0, Math.min(100, Number(range.value)));
    beforeWrap.style.width = `${value}%`;
    handle.style.left = `${Math.max(4, Math.min(96, value))}%`;
  }
  range.addEventListener('input', paint);
  window.addEventListener('resize', syncWidth);
  syncWidth();
  paint();
});

(() => {
  const demo = document.querySelector('[data-split-demo]');
  if (!demo) return;
  const inputA = demo.querySelector('[data-split-input="a"]');
  const inputB = demo.querySelector('[data-split-input="b"]');
  if (!inputA || !inputB) return;
  const bill = 2400;
  const money = (value) => `$${Math.round(value).toLocaleString('en-US')}`;

  function render() {
    const incomeA = Number(inputA.value);
    const incomeB = Number(inputB.value);
    const shareA = incomeA + incomeB > 0 ? incomeA / (incomeA + incomeB) : 0.5;
    const shareB = 1 - shareA;
    const percentA = Math.round(shareA * 100);
    const percentB = 100 - percentA;
    const paymentA = bill * shareA;
    const paymentB = bill - paymentA;
    demo.querySelector('[data-split-out="a"]').textContent = money(incomeA);
    demo.querySelector('[data-split-out="b"]').textContent = money(incomeB);
    demo.querySelector('[data-split-pct="a"]').textContent = `${percentA}%`;
    demo.querySelector('[data-split-pct="b"]').textContent = `${percentB}%`;
    demo.querySelector('[data-split-seg="a"]').style.flexGrow = String(Math.max(shareA, 0.001));
    demo.querySelector('[data-split-seg="b"]').style.flexGrow = String(Math.max(shareB, 0.001));
    demo.querySelector('[data-split-amt="a"]').textContent = money(paymentA);
    demo.querySelector('[data-split-amt="b"]').textContent = money(paymentB);
    const difference = Math.abs(bill / 2 - paymentA);
    const partner = paymentA < bill / 2 ? 'Partner A' : 'Partner B';
    demo.querySelector('[data-split-compare]').innerHTML = difference < 1
      ? 'Equal incomes make the fair split <b>50/50</b>.'
      : `Split 50/50 instead and ${partner} pays <b>${money(difference)}</b> more than their income share.`;
  }

  inputA.addEventListener('input', render);
  inputB.addEventListener('input', render);
  render();
})();

(() => {
  const demo = document.querySelector('[data-continuity-demo]');
  if (!demo) return;
  const title = demo.querySelector('[data-continuity-title]');
  const copy = demo.querySelector('[data-continuity-copy]');
  const buttons = [...demo.querySelectorAll('[data-continuity-step]')];
  const markers = [...demo.querySelectorAll('.workflow-track span')];
  const steps = {
    request: ['Start with the actual request.', 'A correction becomes a concrete target in the real repository—not another plan.'],
    context: ['Recover the working context.', 'The brief, repository state, prior decisions, and current constraint shape the next action.'],
    change: ['Change the actual artifact.', 'Source files are edited in the production project rather than a disconnected mockup.'],
    proof: ['Return evidence, not confidence.', 'Tests, privacy scans, and browser screenshots show what changed and whether it works.']
  };

  function select(button) {
    const key = button.dataset.continuityStep;
    const index = buttons.indexOf(button);
    title.textContent = steps[key][0];
    copy.textContent = steps[key][1];
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    markers.forEach((marker, markerIndex) => marker.classList.toggle('is-active', markerIndex <= index));
  }

  buttons.forEach((button) => button.addEventListener('click', () => select(button)));
  select(buttons[0]);
})();

(() => {
  const dialog = document.querySelector('[data-command-dialog]');
  const openButton = document.querySelector('[data-command-open]');
  const closeButton = document.querySelector('[data-command-close]');
  if (!dialog || !openButton || !closeButton) return;

  function open() {
    if (!dialog.open) dialog.showModal();
  }
  function close() {
    if (dialog.open) dialog.close();
    openButton.focus();
  }

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  dialog.querySelectorAll('[data-command-link]').forEach((link) => link.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) close();
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open();
    }
  });
})();

(() => {
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-contact-status]');
  if (!form || !status) return;
  const button = form.querySelector('button[type="submit"]');

  function show(message, state) {
    status.hidden = false;
    status.dataset.state = state;
    status.textContent = message;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === '1') show('Thanks. Your message was sent, and I’ll reply directly.', 'success');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    button.textContent = 'Sending message';
    status.hidden = true;
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      show('Thanks. Your message was sent, and I’ll reply directly.', 'success');
    } catch {
      show('The message did not send. Please try again in a moment.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Send message';
    }
  });
})();
