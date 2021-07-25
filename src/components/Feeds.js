import createElement from '../libs/createElement.js';

const createItem = ({ title, description }) => {
  const liEl = createElement('li', {
    classes: ['list-group-item', 'text-break', 'pe-0'],
  });
  const titleEl = createElement('p', {
    classes: ['m-0'],
  }, title);
  const descEl = createElement('p', {
    classes: ['text-muted', 'm-0'],
  }, description);
  liEl.append(titleEl, descEl);

  return liEl;
};

const elements = {
  container: createElement('div', {
    classes: ['col-md-4', 'text-end'],
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
    this.rssFeeder = services.rssFeeder;
    this.elements = elements;
  }

  init() {
    this.elements.header.textContent = this.i18n.t('reader.feeds');
    this.elements.container.append(this.elements.header, this.elements.list);
  }

  render(feeds) {
    feeds.forEach((feed) => {
      const title = feed.get('title');
      const description = feed.get('description');
      const item = createItem({ title, description });
      this.elements.list.prepend(item);
    });
  }
}
