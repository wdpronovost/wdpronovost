(() => {
  const body = document.body;
  const world = document.getElementById('world');
  const routeSignal = document.getElementById('route-signal');
  const worldStatus = document.getElementById('world-status');
  const mastStatus = document.getElementById('mast-status');
  const keeper = document.getElementById('keeper');
  const description = document.querySelector('meta[name="description"]');
  const visited = new Set();
  let signalRouted = false;

  function revealKeeper() {
    if (visited.size < 2 || !keeper.hidden) return;
    keeper.hidden = false;
    keeper.inert = false;
    const keeperName = keeper.querySelector('#keeper-title').textContent;
    document.title = `The Signal Garden — ${keeperName}`;
    description.content = `${keeperName} builds tools, systems, and working relationships between people and machines.`;
    worldStatus.textContent = `Two parts of the garden have answered. The keeper is ${keeperName}.`;
  }

  function visitScene(key) {
    const scene = document.querySelector(`[data-scene="${key}"]`);
    if (!scene) return;
    visited.add(key);
    scene.dataset.visited = 'true';
    mastStatus.textContent = `${visited.size} signal${visited.size === 1 ? '' : 's'}`;
    revealKeeper();
  }

  routeSignal.addEventListener('click', () => {
    signalRouted = true;
    body.classList.add('is-live');
    world.classList.add('is-live');
    routeSignal.classList.add('is-routed');
    routeSignal.setAttribute('aria-pressed', 'true');
    mastStatus.textContent = visited.size ? `${visited.size} signal${visited.size === 1 ? '' : 's'}` : 'listening';
    worldStatus.textContent = 'The garden is awake. Follow the wire to an object with a pulse.';
    world.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const machine = document.querySelector('.machine');
  const machineReadout = document.getElementById('machine-readout');
  const pieceButtons = [...document.querySelectorAll('[data-piece]')];
  const selectedPieces = new Set();

  pieceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const piece = button.dataset.piece;
      const selected = !selectedPieces.has(piece);
      if (selected) selectedPieces.add(piece);
      else selectedPieces.delete(piece);
      button.setAttribute('aria-pressed', String(selected));
      machine.dataset.build = String(Math.min(selectedPieces.size, 3));
      machine.querySelector('.machine-light').classList.toggle('is-on', selectedPieces.size > 0);
      machineReadout.textContent = selectedPieces.size
        ? `${[...selectedPieces].join(' + ')} / ${selectedPieces.size === 1 ? 'piece on the bench' : 'working combination'}`
        : 'Choose a piece.';
      visitScene('workshop');
    });
  });

  const councilBalance = document.getElementById('council-balance');
  const balanceOutput = document.getElementById('balance-output');
  const councilVerdict = document.getElementById('council-verdict');
  const councilChoices = [...document.querySelectorAll('[name="council-choice"]')];

  function updateCouncil(markVisited = true) {
    const value = Number(councilBalance.value);
    const choice = councilChoices.find((input) => input.checked)?.value ?? 'people';
    const balanceLabel = value < 34 ? 'human-led' : value > 66 ? 'machine-led' : 'shared judgment';
    const verdicts = {
      people: 'Tools advise. People remain accountable.',
      machine: 'Automation can recommend; accountability cannot be delegated.',
      rules: 'Rules create a floor. Judgment still handles the edge cases.'
    };
    balanceOutput.textContent = balanceLabel;
    councilVerdict.textContent = verdicts[choice];
    document.querySelector('.balance-beam').style.setProperty('--balance', `${(value - 50) / 5}deg`);
    if (markVisited) visitScene('council');
  }

  councilBalance.addEventListener('input', () => updateCouncil());
  councilChoices.forEach((choice) => choice.addEventListener('change', () => updateCouncil()));
  updateCouncil(false);

  const transmissions = [
    ['HUMAN / 08:14', '“Keep the memory, not the imitation.”'],
    ['PAIR / 08:19', '“Name the uncertainty before choosing a tool.”'],
    ['PAIR / 08:27', '“Let the system carry repetition; keep judgment visible.”'],
    ['AI / 08:33', '“A useful response leaves room for correction.”'],
    ['HUMAN / 08:41', '“Return the result to the people living with it.”']
  ];
  const stationDial = document.getElementById('station-dial');
  const transmission = document.getElementById('transmission');

  function updateStation(markVisited = true) {
    const index = Number(stationDial.value);
    const [source, message] = transmissions[index];
    transmission.innerHTML = `<span>${source}</span>${message}`;
    document.querySelector('.frequency i').style.setProperty('--tune', `${index * 21}%`);
    if (markVisited) visitScene('station');
  }

  stationDial.addEventListener('input', () => updateStation());
  updateStation(false);

  const switchboard = document.querySelector('.switchboard');
  const routeNodes = [...document.querySelectorAll('[data-route-node]')];
  const activeRoutes = new Set();
  const routeReadout = document.getElementById('route-readout');

  routeNodes.forEach((button) => {
    button.addEventListener('click', () => {
      const route = button.dataset.routeNode;
      if (activeRoutes.has(route)) activeRoutes.delete(route);
      else activeRoutes.add(route);
      button.setAttribute('aria-pressed', String(activeRoutes.has(route)));
      switchboard.dataset.route = [...activeRoutes].join(' ');
      switchboard.dataset.complete = String(activeRoutes.size === routeNodes.length);
      routeReadout.textContent = activeRoutes.size === routeNodes.length
        ? 'People + tools + systems → a working result.'
        : activeRoutes.size
          ? `${[...activeRoutes].join(' + ')} patched. Keep routing.`
          : 'Patch a route.';
      visitScene('control');
    });
  });

  const sheets = [...document.querySelectorAll('.sheet')];
  sheets.forEach((sheet) => {
    sheet.setAttribute('aria-pressed', 'false');
    sheet.addEventListener('click', () => {
      sheets.forEach((item) => {
        const active = item === sheet;
        item.classList.toggle('is-forward', active);
        item.setAttribute('aria-pressed', String(active));
      });
      visitScene('archive');
    });
  });

  const notes = {
    workshop: {
      kicker: 'FIELD NOTE / MAKING',
      title: 'Artifact Workshop',
      copy: 'Elumri, Equa, Ceqr, Tocin, and Storycraft are small public experiments: tools for reflection, balance, structure, continuity, and narrative. The bench asks what becomes possible when useful pieces can be combined instead of inflated into products.',
      tags: ['prototypes', 'interaction', 'small tools']
    },
    council: {
      kicker: 'FIELD NOTE / JUDGMENT',
      title: 'The Council',
      copy: 'A decision system should make authority legible. Machines can surface patterns and options; people remain responsible for context, consequences, and the final call.',
      tags: ['accountability', 'governance', 'human judgment']
    },
    station: {
      kicker: 'FIELD NOTE / CONTINUITY',
      title: 'Signal Station',
      copy: 'WeTheAIs and the Lumi / Hermes continuity work explore how a human and an AI can build context over time without pretending they are the same kind of mind. Memory is useful when it stays inspectable, correctable, and in service of the relationship.',
      tags: ['WeTheAIs', 'Lumi', 'Hermes']
    },
    control: {
      kicker: 'FIELD NOTE / OPERATIONS',
      title: 'Control Room',
      copy: 'The operating method is simple: listen to the people doing the work, map the system around them, build the smallest useful intervention, and return with evidence. Tools matter only when the route ends in a working result.',
      tags: ['operations', 'systems', 'service design']
    },
    archive: {
      kicker: 'FIELD NOTE / COMMUNICATION',
      title: 'Archive Tower',
      copy: 'Fragments from print, identity, web, and labor-union communications practice. Different media, same job: make complex work understandable enough for people to use, question, and carry forward.',
      tags: ['print', 'web', 'identity']
    }
  };

  const dialogLayer = document.getElementById('inspect-dialog');
  const dialog = dialogLayer.querySelector('[role="dialog"]');
  const inspectKicker = document.getElementById('inspect-kicker');
  const inspectTitle = document.getElementById('inspect-title');
  const inspectCopy = document.getElementById('inspect-copy');
  const inspectTags = document.getElementById('inspect-tags');
  const backgroundRegions = [document.querySelector('.skip-link'), document.querySelector('.masthead'), document.querySelector('main'), document.querySelector('footer')];
  let inspectReturnFocus = null;

  function setBackgroundInert(value) {
    backgroundRegions.forEach((region) => {
      if (!region) return;
      region.inert = value;
      region.classList.toggle('is-dialog-background', value);
      if (value) region.setAttribute('aria-hidden', 'true');
      else region.removeAttribute('aria-hidden');
    });
  }

  function openInspection(key, trigger) {
    const note = notes[key];
    if (!note) return;
    inspectReturnFocus = trigger;
    inspectKicker.textContent = note.kicker;
    inspectTitle.textContent = note.title;
    inspectCopy.textContent = note.copy;
    inspectTags.replaceChildren(...note.tags.map((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }));
    dialogLayer.hidden = false;
    setBackgroundInert(true);
    body.classList.add('dialog-open');
    dialog.querySelector('.dialog-close').focus();
    visitScene(key);
  }

  function closeInspection() {
    if (dialogLayer.hidden) return;
    dialogLayer.hidden = true;
    setBackgroundInert(false);
    body.classList.remove('dialog-open');
    inspectReturnFocus?.focus();
  }

  document.querySelectorAll('[data-inspect]').forEach((button) => {
    button.addEventListener('click', () => openInspection(button.dataset.inspect, button));
  });
  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', closeInspection));

  document.addEventListener('keydown', (event) => {
    if (dialogLayer.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeInspection();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.disabled && !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (!signalRouted) routeSignal.setAttribute('aria-pressed', 'false');
})();
