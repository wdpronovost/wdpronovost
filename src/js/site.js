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
  workNote.innerHTML = `Showing ${relatedProjects.length} named works connected to <strong>${detail.label}</strong>: ${relatedNames.join(', ')}.`;
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
