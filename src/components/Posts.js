import createElement from '../libs/createElement.js';

const createItem = (item, buttonText) => {
  const { title, link } = item;

  const liEl = createElement('li', {
    classes: ['list-group-item', 'text-break', 'ps-0', 'py-3'],
  });
  const titleEl = createElement('a', {
    href: link || '#',
    target: '_blank',
    classes: ['fw-bold'],
  }, title);
  const buttonEl = createElement('button', {
    type: 'button',
    classes: ['btn', 'btn-outline-primary', 'btn-sm', 'me-4'],
  }, buttonText);
  liEl.append(buttonEl, titleEl);

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
    this.rssFeeder = services.rssFeeder;
    this.elements = elements;
  }

  init() {
    const t = this.i18n.t.bind(this.i18n);
    this.elements.header.textContent = t('reader.posts');
    this.elements.container.append(this.elements.header, this.elements.list);
  }

  render(posts) {
    const buttonText = this.i18n.t('button.show');

    posts.forEach((post) => {
      const title = post.get('title');
      const link = post.get('link');
      const itemEl = createItem({ title, link }, buttonText);
      this.elements.list.prepend(itemEl);
    });
  }
}
