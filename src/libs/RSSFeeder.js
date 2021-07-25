import createHTTPClient from './createHTTPClient.js';
import AppError from '../AppError.js';

const rssToObj = (rootElement, feed) => {
  const iter = (element, accum) => {
    const key = element.tagName;
    const value = (element.children.length === 0)
      ? element.textContent
      : Array.from(element.children).reduce((acc, item) => iter(item, acc), new Map());

    if (key === 'item') {
      const items = accum.has('items') ? accum.get('items') : [];
      value.set('feed', feed);
      items.unshift(value);
      accum.set('items', items);
    } else {
      accum.set(key, value);
    }

    return accum;
  };

  try {
    return iter(rootElement, new Map());
  } catch (err) {
    throw new AppError(err, 'parsing');
  }
};

const validate = async (link, feeds) => {
  let url;

  try {
    url = new URL(link);
  } catch (err) {
    throw new AppError(err, 'validation.url');
  }

  if (feeds.has(url.toString())) {
    throw new AppError('Url not unique', 'validation.unique');
  }
};

export default class RSSFeeder {
  constructor(params = {}) {
    this.httpClient = createHTTPClient(params);
    this.parser = new DOMParser();
    this.sources = new Map([
      ['feeds', new Map()],
      ['posts', []],
    ]);
    this.syncPeriod = params.RSS_SYNC_PERIOD;
    this.listeners = [];
    this.state = {
      autoSync: 'stop',
      loadedFeedsMap: new Map(),
      fakeMode: false,
    };
  }

  addByUrl(link, fakeMode = false) {
    this.state.fakeMode = fakeMode;
    const feeds = this.sources.get('feeds');
    const posts = this.sources.get('posts');

    return validate(link, feeds)
      .then(() => this.httpClient.get(link, fakeMode))
      .then((rawData) => this.parse(rawData, link))
      .then((parsedData) => {
        const feed = parsedData.get('channel');
        const feedPosts = Array.from(feed.get('items'));
        posts.push(...feedPosts);
        feed.delete('items');
        feed.set('feed', link);
        feeds.set(link, feed);
      })
      .then(() => this.notify())
      .then(() => true);
  }

  enableAutoSync() {
    this.state.autoSync = 'run';

    const sync = () => {
      setTimeout(() => ((this.state.autoSync === 'run')
        ? this.updatePosts()
          .then((hasUpdates) => (hasUpdates ? this.notify() : false))
          .then(() => sync())
        : false),
      this.syncPeriod);
    };

    sync();
  }

  // "private"

  parse(data, feed) {
    const document = this.parser.parseFromString(data, 'text/xml');
    const { documentElement: { tagName } } = document;
    if (tagName !== 'rss') {
      throw new AppError(`Data format is not RSS, is ${tagName}`, 'parsing');
    }
    const channelEl = document.querySelector('channel');

    return rssToObj(channelEl, feed);
  }

  updatePosts() {
    const feeds = Array.from(this.sources.get('feeds').keys());
    const posts = this.sources.get('posts');
    const postGuidsByFeeds = Array.from(posts).reduce((acc, post) => {
      const feed = post.get('feed');
      const guid = post.get('guid');
      if (acc.has(feed)) {
        acc.get(feed).push(guid);
      } else {
        acc.set(feed, [guid]);
      }
      return acc;
    }, new Map());

    const newPostPromises = feeds.map((feed) => this.httpClient
      .get(feed, this.state.fakeMode)
      .then((rawData) => this.parse(rawData, feed))
      .then((parsedData) => Array.from(parsedData.get('channel').get('items')))
      .then((allPosts) => {
        const postGuidsInFeed = postGuidsByFeeds.get(feed);
        return allPosts.filter((post) => !postGuidsInFeed.includes(post.get('guid')));
      })
      .then((newPosts) => {
        if (newPosts.length > 0) {
          posts.push(...newPosts);
          return true;
        }
        return false;
      }));

    return Promise.all(newPostPromises)
      .then((updates) => updates.some((wasUpdated) => wasUpdated));
  }

  // -- observer

  addUpdateListener(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.feeds));
  }
}
