import { createElement } from '../helpers.js';

const createItem = ({ name, description }) => {
  const liEl = createElement('li', {
    classes: ['list-group-item', 'text-break', 'pe-0'],
  });
  const nameEl = createElement('p', {
    classes: ['m-0'],
  }, name);
  const descEl = createElement('p', {
    classes: ['text-muted', 'm-0'],
  }, description);
  liEl.append(nameEl, descEl);

  return liEl;
};

const elements = {
  container: createElement('div', {
    classes: ['col-sm-4', 'text-end'],
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
    this.elements.header.textContent = this.t('reader.feeds');
    this.elements.container.append(this.elements.header, this.elements.list);

    const items = [{ name: 'Hello', description: 'Kitty & Doge' }, { name: 'Goodbye', description: 'World' }];
    items.forEach((item) => this.elements.list.append(createItem(item)));
  }
}
