/* Voices A/B — two live treatments for a review-sourced section. */
(() => {
  'use strict';

  const LABELS = {
    sourced: 'A — Sourced quotes (verbatim, role + year)',
    paraphrase: 'B — Paraphrased themes (no quotable text)',
    neither: 'NEITHER — do not build this section yet'
  };
  const STORAGE_KEY = 'wdp-voices-ab-v1';
  const state = { pick: '', free: '' };

  const progress = document.querySelector('[data-progress]');
  const result = document.querySelector('[data-result]');
  const resultLine = document.querySelector('[data-result-line]');
  const resultText = document.querySelector('[data-result-text]');
  const free = document.querySelector('[data-free]');
  const buttons = [...document.querySelectorAll('[data-pick]')];

  /* ---------- reveal (threshold 0 + unconditional failsafe) ---------- */
  const items = [...document.querySelectorAll('[data-reveal]')];
  function revealAll() { items.forEach((el) => el.classList.add('is-in')); }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    revealAll();
  }
  setTimeout(revealAll, 2500);

  /* ---------- persistence ---------- */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Comparison stays usable when storage is blocked.
    }
  }

  function render() {
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.pick === state.pick));
    });
    if (progress) {
      progress.textContent = state.pick ? `Picked: ${LABELS[state.pick]}` : 'Nothing picked yet';
    }
    if (!state.pick) {
      if (result) result.hidden = true;
      if (resultText) resultText.value = '';
      return;
    }
    if (result) result.hidden = false;
    if (resultLine) resultLine.textContent = LABELS[state.pick];
    if (resultText) {
      const note = state.free.trim() ? `\n\nAlso: ${state.free.trim()}` : '';
      resultText.value = `Voices section direction:\n- ${LABELS[state.pick]}${note}`;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.pick = btn.dataset.pick;
      save();
      render();
    });
  });

  if (free) {
    free.addEventListener('input', () => {
      state.free = free.value;
      save();
      render();
    });
  }

  const copyBtn = document.querySelector('[data-copy]');
  if (copyBtn && resultText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(resultText.value);
      } catch {
        resultText.select();
      }
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy summary'; }, 1600);
    });
  }

  const resetBtn = document.querySelector('[data-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.pick = '';
      state.free = '';
      if (free) free.value = '';
      if (resultText) resultText.value = '';
      if (resultLine) resultLine.textContent = '';
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing further to clear when storage is unavailable.
      }
      render();
    });
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return;
      if (typeof saved.pick === 'string' && LABELS[saved.pick]) state.pick = saved.pick;
      if (typeof saved.free === 'string') {
        state.free = saved.free;
        if (free) free.value = saved.free;
      }
    } catch {
      // Start clean on malformed local state.
    }
  }

  restore();
  render();
})();
