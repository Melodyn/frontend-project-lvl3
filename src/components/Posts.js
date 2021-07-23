import createElement from '../libs/createElement.js';

const createItem = ({ title, visited, link }, t) => {
  const liEl = createElement('li', {
    classes: ['list-group-item', 'text-break', 'ps-0', 'py-3'],
  });
  const titleEl = createElement('a', {
    href: link || '#',
    target: '_blank',
    ...(visited ? { classes: ['text-muted'] } : {}),
  }, title);
  const buttonEl = createElement('button', {
    type: 'button',
    classes: ['btn', visited ? 'btn-outline-secondary' : 'btn-outline-primary', 'btn-sm', 'me-4'],
  }, t('button.show'));
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

    const items = [
      { title: 'http://lorem-rss.herokuapp.com/feed', link: 'http://lorem-rss.herokuapp.com/feed', visited: false },
      { title: 'https://ru.hexlet.io/lessons.rss', link: 'https://ru.hexlet.io/lessons.rss', visited: true },
      { title: 'https://cv.hexlet.io/vacancies.rss', link: 'https://cv.hexlet.io/vacancies.rss', visited: false },
    ];
    items.forEach((item) => this.elements.list.append(createItem(item, t)));
  }

  render() {
    const t = this.i18n.t.bind(this.i18n);
    this.elements.list.innerHTML = '';
    this.rssFeeder.feeds.forEach((feed) => {
      const items = feed.get('channel').get('items');

      items.forEach((item) => {
        const title = item.get('title');
        const link = item.get('link');
        const itemEl = createItem({ title, link }, t);
        this.elements.list.prepend(itemEl);
      });
    });
  }
}
