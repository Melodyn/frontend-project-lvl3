import createElement from '../libs/createElement.js';
import Posts from './Posts.js';
import Feeds from './Feeds.js';

const getElements = () => ({
  container: createElement('div', {
    classes: ['container', 'pb-5', 'invisible'],
  }),
  row: createElement('div', {
    classes: ['row'],
  }),
});

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

  init(view) {
    this.posts.init();
    this.feeds.init();

    this.elements.row.append(
      this.elements.feeds.container,
      this.elements.posts.container,
    );
    this.elements.container.append(this.elements.row);

    this.rssFeeder.addEventListener('add.feed', (feed) => {
      if (view.uiState.reader.isHidden) {
        view.uiState.reader.isHidden = false;
      }
      view.newFeeds = [feed];
    });
    this.rssFeeder.addEventListener('add.posts', (posts) => {
      view.newPosts = posts.reverse();
    });
  }

  render() {
    this.elements.container.classList.remove('invisible');
  }
}
