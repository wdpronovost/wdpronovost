const modes = {
  leader: {
    title: 'Make the work legible.',
    copy: 'Turn competing needs into a direction people can understand, question, and carry forward together.',
    connection: 'systems thinking + product building',
    label: 'technology leadership'
  },
  builder: {
    title: 'Give the idea a useful shape.',
    copy: 'Find the smallest honest version of a product that can teach us something—and make it real enough to use.',
    connection: 'design + software development',
    label: 'product building'
  },
  developer: {
    title: 'Close the distance to working.',
    copy: 'Write the code, test the behavior, and stay near enough to the person using it to notice what the spec missed.',
    connection: 'product building + systems thinking',
    label: 'software development'
  },
  designer: {
    title: 'Make the next step feel natural.',
    copy: 'Use language, hierarchy, and interaction to help people understand where they are and what they can do.',
    connection: 'communications + product building',
    label: 'design'
  },
  systems: {
    title: 'Notice what the parts do together.',
    copy: 'Trace decisions across tools, teams, and time so the whole system supports the people inside it.',
    connection: 'technology leadership + development',
    label: 'systems thinking'
  },
  collaborator: {
    title: 'Keep the person in the loop.',
    copy: 'Work with AI as a capable collaborator while preserving judgment, context, authorship, and human agency.',
    connection: 'systems thinking + product building',
    label: 'human–AI collaboration'
  }
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.querySelector('#mode-panel');
const title = document.querySelector('#evidence-title');
const copy = document.querySelector('#evidence-copy');
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
  });
  panel.setAttribute('aria-labelledby', tab.id);
  title.textContent = detail.title;
  copy.textContent = detail.copy;
  connection.innerHTML = `<span>Connects to</span> ${detail.connection}`;
  workNote.innerHTML = `Showing work connected to <strong>${detail.label}</strong>. Choose another mode above to shift the emphasis.`;
  projects.forEach((project) => project.classList.toggle('is-related', project.dataset.modes.split(' ').includes(mode)));
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
