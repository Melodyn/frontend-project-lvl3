import { createElement } from '../helpers.js';
import Posts from './Posts.js';
import Feeds from './Feeds.js';

const elements = {
  container: createElement('div', {
    classes: ['container'],
  }),
  row: createElement('div', {
    classes: ['row'],
  }),
};

export default class Reader {
  constructor(services) {
    this.t = services.i18n;
    this.posts = new Posts(services);
    this.feeds = new Feeds(services);
    this.elements = {
      ...elements,
      posts: this.posts.elements,
      feeds: this.feeds.elements,
    };
  }

  init() {
    this.posts.init();
    this.feeds.init();

    this.elements.row.append(
      this.elements.feeds.container,
      this.elements.posts.container,
    );
    this.elements.container.append(this.elements.row);
  }
}
