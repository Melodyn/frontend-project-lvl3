import createElement from '../libs/createElement.js';

const createItem = ({ name, visited }, t) => {
  const liEl = createElement('li', {
    classes: ['list-group-item', 'text-break', 'ps-0', 'py-3'],
  });
  const nameEl = createElement('a', {
    href: '#',
    ...(visited ? { classes: ['text-muted'] } : {}),
  }, name);
  const buttonEl = createElement('button', {
    type: 'button',
    classes: ['btn', visited ? 'btn-outline-secondary' : 'btn-outline-primary', 'btn-sm', 'me-4'],
  }, t('button.show'));
  liEl.append(buttonEl, nameEl);

  return liEl;
};

const elements = {
  container: createElement('div', {
    classes: ['col-sm-8', 'order-sm-first'],
  }),
  header: createElement('h2', {
    classes: ['h3'],
  }),
  list: createElement('ul', {
    classes: ['list-group', 'list-group-flush'],
  }),
};

export default class Feeds {
  constructor(services) {
    this.i18n = services.i18n;
    this.elements = elements;
  }

  init() {
    const t = this.i18n.t.bind(this.i18n);
    this.elements.header.textContent = t('reader.posts');
    this.elements.container.append(this.elements.header, this.elements.list);

    const items = [
      { name: 'Hello Kitty', visited: false },
      { name: 'Goodbye World', visited: true },
      { name: 'Hello Doge', visited: false },
    ];
    items.forEach((item) => this.elements.list.append(createItem(item, t)));
  }
}
