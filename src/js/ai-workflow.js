const board = document.querySelector('[data-flow-board]');
if (board) {
  const buttons = Array.from(board.querySelectorAll('[data-flow-step]'));
  const cards = Array.from(board.querySelectorAll('[data-flow-card]'));
  const nodes = Array.from(board.querySelectorAll('[data-svg-node]'));
  const select = (id) => {
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.flowStep === id)));
    cards.forEach((card) => card.classList.toggle('is-active', card.dataset.flowCard === id));
    nodes.forEach((node) => node.classList.toggle('is-active', node.dataset.svgNode === id));
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.flowStep));
    button.addEventListener('keydown', (event) => {
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      buttons[next].focus();
      select(buttons[next].dataset.flowStep);
    });
  });
  select('source');
}
