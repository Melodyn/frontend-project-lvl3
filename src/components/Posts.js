import createElement from '../libs/createElement.js';

const createItem = (post, buttonText, view) => {
  const description = post.get('description');
  const title = post.get('title');
  const link = post.get('link');
  const id = `post${post.get('id')}`;

  const liEl = createElement('li', {
    id,
    'data-description': description,
    classes: ['list-group-item', 'd-flex', 'ps-0', 'py-3'],
  });
  const titleEl = createElement('a', {
    href: link,
    target: '_blank',
    classes: ['fw-bold'],
  }, title);
  const buttonEl = createElement('button', {
    type: 'button',
    classes: ['btn', 'btn-outline-primary', 'btn-sm', 'me-4', 'mb-auto'],
  }, buttonText);
  liEl.append(buttonEl, titleEl);

  titleEl.addEventListener('click', () => {
    view.uiState.reader.visitedPost = { id, visitType: 'away' };
  });
  buttonEl.addEventListener('click', () => {
    view.uiState.reader.visitedPost = { id, visitType: 'preview' };
  });

  return liEl;
};

const elements = {
  container: createElement('div', {
    classes: ['col-md-8', 'order-md-first'],
  }),
  header: createElement('h2', {
    classes: ['h3'],
  }),
  list: createElement('ul', {
    classes: ['list-group', 'list-group-flush'],
  }),
};

export default class Posts {
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

  renderPosts(posts, view) {
    const buttonText = this.i18n.t('button.show');

    posts.forEach((post) => {
      const itemEl = createItem(post, buttonText, view);
      this.elements.list.prepend(itemEl);
    });
  }

  renderVisitedPost(visitedPost) {
    const { id, visitType } = visitedPost;

    const postEl = this.elements.list.querySelector(`#${id}`);
    const buttonEl = postEl.querySelector('button');
    const titleEl = postEl.querySelector('a');

    titleEl.classList.remove('fw-bold');
    titleEl.classList.add('fw-normal', 'text-muted');
    buttonEl.classList.remove('btn-outline-primary');
    buttonEl.classList.add('btn-outline-secondary');

    if (visitType === 'preview') {
      const title = titleEl.textContent;
      const { description } = postEl.dataset;
      const link = titleEl.href;
      // eslint-disable-next-line no-alert
      alert(`${title}\n\n${description}\n----\n${link}`);
    }
  }
}
