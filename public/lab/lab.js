/* Direction picker — every option is a live running demo, not a description. */
(() => {
  'use strict';

  const LABELS = {
    'arrival:soft': 'Content arrival — Soft lift (current)',
    'arrival:wipe': 'Content arrival — Mask wipe (sharper, editorial)',
    'arrival:snap': 'Content arrival — No motion (instant)',
    'arrival:neither': 'Content arrival — NEITHER',
    'ai:stream': 'AI presence — It writes itself (streaming text)',
    'ai:ticker': 'AI presence — Live agent activity ticker',
    'ai:margin': 'AI presence — Quiet margin notes',
    'ai:diff': 'AI presence — Show the diff (AI edit applied live)',
    'ai:neither': 'AI presence — NEITHER',
    'hero:still': 'Hero — Still & typographic',
    'hero:alive': 'Hero — Quietly alive (letters settle, word cycles)',
    'hero:neither': 'Hero — NEITHER',
    'feel:instant': 'Interaction feel — Instant / precise',
    'feel:spring': 'Interaction feel — Weighted / physical',
    'feel:neither': 'Interaction feel — NEITHER',
    'ambient:none': 'Background — Dead still',
    'ambient:drift': 'Background — Slow drift shapes',
    'ambient:pulse': 'Background — Signal pulse',
    'ambient:neither': 'Background — NEITHER'
  };
  const QUESTIONS = ['arrival', 'ai', 'hero', 'feel', 'ambient'];
  const STORAGE_KEY = 'wdp-design-lab-v1';
  const picks = Object.create(null);

  /* ---------- demo runners ---------- */
  const STREAM_TEXT = 'I build small, useful systems with AI in the loop.';
  function runStream(stage) {
    const out = stage.querySelector('[data-stream]');
    if (!out) return;
    out.classList.remove('done');
    out.textContent = '';
    let i = 0;
    clearInterval(out._timer);
    out._timer = setInterval(() => {
      out.textContent = STREAM_TEXT.slice(0, ++i);
      if (i >= STREAM_TEXT.length) {
        clearInterval(out._timer);
        out.classList.add('done');
      }
    }, 34);
  }

  const TICKS = [
    ['read', 'equa/PRODUCT.md'],
    ['patch', 'src/index.html +84'],
    ['test', '18 passed'],
    ['deploy', 'live in 41s']
  ];
  function runTicker(stage) {
    const list = stage.querySelector('[data-ticker] ol');
    if (!list) return;
    list.innerHTML = '';
    TICKS.forEach(([verb, detail], i) => {
      const li = document.createElement('li');
      li.style.animationDelay = (i * 0.42) + 's';
      const b = document.createElement('b');
      b.textContent = verb;
      li.append(b, document.createTextNode(detail));
      list.appendChild(li);
    });
  }

  function restartCss(el) {
    if (!el) return;
    el.classList.remove('run');
    void el.offsetWidth; // force reflow so the animation replays
    el.classList.add('run');
  }

  const CYCLE = ['small', 'useful', 'honest', 'durable'];
  function startCycle(stage) {
    const el = stage.querySelector('[data-cycle]');
    if (!el) return;
    clearInterval(el._timer);
    let i = 0;
    el.textContent = CYCLE[0];
    el._timer = setInterval(() => {
      i = (i + 1) % CYCLE.length;
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = CYCLE[i];
        el.style.transition = 'opacity .3s ease';
        el.style.opacity = '1';
      }, 200);
    }, 2100);
  }

  function play(stage) {
    if (!stage) return;
    restartCss(stage.querySelector('.demo-soft, .demo-wipe, .demo-margin, .demo-diff, .demo-hero-alive'));
    runStream(stage);
    runTicker(stage);
    startCycle(stage);
  }

  /* ---------- replay buttons ---------- */
  document.querySelectorAll('[data-replay]').forEach((btn) => {
    btn.addEventListener('click', () => play(btn.closest('.opt').querySelector('[data-stage]')));
  });

  /* ---------- autoplay each demo when scrolled into view ---------- */
  const stages = [...document.querySelectorAll('[data-stage]')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target._played) {
          entry.target._played = true;
          play(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stages.forEach((stage) => io.observe(stage));
  } else {
    stages.forEach(play);
  }

  /* ---------- interaction-feel demos ---------- */
  document.querySelectorAll('[data-feel]').forEach((input) => {
    const kind = input.dataset.feel;
    const bar = document.querySelector(`[data-feelbar="${kind}"]`);
    const num = document.querySelector(`[data-feelnum="${kind}"]`);
    input.addEventListener('input', () => {
      const v = Number(input.value);
      if (bar) bar.style.width = v + '%';
      if (num) num.textContent = v + '%';
    });
  });

  /* ---------- picking ---------- */
  const progress = document.querySelector('[data-progress]');
  const result = document.querySelector('[data-result]');
  const resultList = document.querySelector('[data-result-list]');
  const resultText = document.querySelector('[data-result-text]');
  const free = document.querySelector('[data-free]');

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ picks, free: free ? free.value : '' }));
    } catch {
      // The Lab remains fully usable when storage is unavailable.
    }
  }

  function applyChoice(question, key) {
    const section = document.querySelector(`[data-q="${question}"]`);
    if (!section) return;
    section.classList.toggle('is-done', Boolean(key));
    section.querySelectorAll('[data-opt]').forEach((option) => {
      const selected = option.dataset.opt === key;
      option.classList.toggle('is-picked', selected);
      const button = option.querySelector('[data-pick]');
      if (button) button.setAttribute('aria-pressed', String(selected));
    });
    const neither = section.querySelector('[data-neither]');
    if (neither) {
      const selected = Boolean(key && key.endsWith(':neither'));
      neither.classList.toggle('is-picked', selected);
      neither.setAttribute('aria-pressed', String(selected));
    }
  }

  function render() {
    const chosen = QUESTIONS.filter((q) => picks[q]);
    if (progress) progress.textContent = `${chosen.length} of ${QUESTIONS.length} chosen`;

    if (!chosen.length) {
      if (result) result.hidden = true;
      return;
    }
    if (result) result.hidden = false;
    if (resultList) resultList.innerHTML = '';
    const lines = [];
    chosen.forEach((q) => {
      const key = picks[q];
      const label = LABELS[key] || key;
      lines.push('- ' + label);
      if (resultList) {
        const li = document.createElement('li');
        li.textContent = label;
        resultList.appendChild(li);
      }
    });
    if (resultText) {
      const note = free && free.value.trim() ? `\n\nAlso: ${free.value.trim()}` : '';
      resultText.value = `Design direction from the WDP Lab:\n${lines.join('\n')}${note}`;
    }
  }

  function choose(question, key) {
    picks[question] = key;
    applyChoice(question, key);
    saveState();
    render();
  }

  document.querySelectorAll('[data-pick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const opt = btn.closest('[data-opt]');
      const key = opt.dataset.opt;
      choose(key.split(':')[0], key);
    });
  });

  document.querySelectorAll('[data-neither]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.closest('.q').dataset.q;
      choose(q, q + ':neither');
    });
  });

  if (free) free.addEventListener('input', () => {
    saveState();
    render();
  });

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
      QUESTIONS.forEach((question) => {
        delete picks[question];
        applyChoice(question, '');
      });
      if (free) free.value = '';
      if (resultText) resultText.value = '';
      if (resultList) resultList.innerHTML = '';
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing else to reset when storage is unavailable.
      }
      render();
    });
  }

  function restoreSavedState() {
    QUESTIONS.forEach((question) => applyChoice(question, ''));
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return;
      QUESTIONS.forEach((question) => {
        const key = saved.picks && saved.picks[question];
        if (typeof key === 'string' && key.startsWith(question + ':') && LABELS[key]) {
          picks[question] = key;
          applyChoice(question, key);
        }
      });
      if (free && typeof saved.free === 'string') free.value = saved.free;
    } catch {
      // Ignore malformed or blocked local state and start clean.
    }
  }

  restoreSavedState();
  render();
})();
