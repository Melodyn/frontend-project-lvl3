import createElement from '../libs/createElement.js';
import Posts from './Posts.js';
import Feeds from './Feeds.js';

const getElements = () => ({
  container: createElement('div', {
    classes: ['container', 'pb-5'],
  }),
  row: createElement('div', {
    classes: ['row'],
  }),
});

// ----

export default class Reader {
  constructor(services) {
    this.i18n = services.i18n;
    this.rssFeeder = services.rssFeeder;
    this.posts = new Posts(services);
    this.feeds = new Feeds(services);
    this.elements = {
      ...getElements(),
      posts: this.posts.elements,
      feeds: this.feeds.elements,
    };
  }

  init(state) {
    this.posts.init();
    this.feeds.init();

    this.elements.row.append(
      this.elements.feeds.container,
      this.elements.posts.container,
    );
    this.elements.container.append(this.elements.row);

    this.rssFeeder.addEventListener('add.feeds', (feeds) => {
      state.feeds.push(...feeds);
    });
    this.rssFeeder.addEventListener('add.posts', (posts) => {
      const reversedPosts = posts.reverse();
      state.posts.push(...reversedPosts);
    });
  }
}
