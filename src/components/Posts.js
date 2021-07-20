import { createElement } from '../helpers.js';

const createItem = ({ name, visited }, t) => {
  const liEl = createElement('li', {
    classes: ['list-group-item', 'text-break', 'ps-0', 'py-3'],
  });
  const nameEl = createElement('a', {
    href: '#',
    ...(visited ? { class: 'text-muted' } : {}),
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
    this.t = services.i18n;
    this.elements = elements;
  }

  init() {
    this.elements.header.textContent = this.t('reader.posts');
    this.elements.container.append(this.elements.header, this.elements.list);

    const items = [
      { name: 'Hello Kitty', visited: false },
      { name: 'Goodbye World', visited: true },
      { name: 'Hello Doge', visited: false },
    ];
    items.forEach((item) => this.elements.list.append(createItem(item, this.t)));
  }
}
