import createHTTPClient from './createHTTPClient.js';
import AppError from '../AppError.js';

const idGen = () => {
  let start = 0;
  return () => {
    start += 1;
    return start;
  };
};

const rssToObj = (rootElement) => {
  const iter = (element, accum) => {
    const key = element.tagName;
    const value = (element.children.length === 0)
      ? element.textContent
      : Array.from(element.children).reduce((acc, item) => iter(item, acc), new Map());

    if (key === 'item') {
      const items = accum.has('items') ? accum.get('items') : [];
      items.push(value);
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

  const feedsLinks = feeds.map((feed) => feed.get('feed'));
  if (feedsLinks.includes(url.toString())) {
    throw new AppError('Url not unique', 'validation.unique');
  }
};

export default class RSSFeeder {
  constructor(params = {}) {
    this.syncPeriod = params.RSS_SYNC_PERIOD;
    this.autoSyncState = 'stop';

    this.idGen = idGen();
    this.httpClient = createHTTPClient(params);

    this.parser = new DOMParser();
    this.sources = new Map([
      ['feeds', []],
      ['posts', []],
    ]);
    this.listeners = new Map([
      ['add.feeds', []],
      ['add.posts', []],
    ]);
  }

  addByUrl(link) {
    const feeds = this.sources.get('feeds');

    return validate(link, feeds)
      .then(() => this.httpClient.get(link))
      .then((rawData) => this.parse(rawData, link))
      .then((parsedData) => {
        const feed = parsedData.get('channel');
        const feedPosts = Array.from(feed.get('items'));
        feed.delete('items');

        const [savedFeed] = this.insert('feeds', [feed], {
          feed: link,
        });
        this.insert('posts', feedPosts, {
          feedId: savedFeed.get('id'),
        });
      });
  }

  enableAutoSync() {
    this.autoSyncState = 'run';

    const sync = () => {
      setTimeout(() => ((this.autoSyncState === 'run')
        ? this.updatePosts()
          .then(() => sync())
          .catch((err) => {
            console.error(err);
            return sync();
          })
        : false),
      this.syncPeriod);
    };

    sync();
  }

  // "private"

  parse(data) {
    const document = this.parser.parseFromString(data, 'text/xml');
    const { documentElement: { tagName } } = document;
    if (tagName !== 'rss') {
      throw new AppError(`Data format is not RSS, is ${tagName}`, 'parsing');
    }
    const channelEl = document.querySelector('channel');

    const parsedFeed = rssToObj(channelEl);
    const channel = parsedFeed.get('channel');
    if (!channel.has('items')) {
      channel.set('items', []);
    }
    return parsedFeed;
  }

  updatePosts() {
    const feeds = this.sources.get('feeds');

    const newPostPromises = feeds.map((feed) => {
      const feedLink = feed.get('feed');
      const feedId = feed.get('id');
      const feedPosts = this.select('posts', 'title', { feedId });

      return this.httpClient.get(feedLink)
        .then((rawData) => this.parse(rawData))
        .then((parsedData) => Array.from(parsedData.get('channel').get('items')))
        .then((allPosts) => allPosts.filter((post) => !feedPosts.includes(post.get('title'))))
        .then((newPosts) => this.insert('posts', newPosts, { feedId }));
    });

    return Promise.all(newPostPromises);
  }

  // -- database

  insert(repositoryName, data, extraFields = {}) {
    const repository = this.sources.get(repositoryName);
    const extraFieldsEntries = Object.entries(extraFields);
    data.forEach((item) => {
      item.set('id', this.idGen());
      extraFieldsEntries.forEach(([key, value]) => item.set(key, value));
    });
    repository.push(...data);

    this.notify(`add.${repositoryName}`, data);

    return data;
  }

  select(repositoryName, fieldName, where) {
    const data = this.sources.get(repositoryName);
    const wheres = Object.entries(where);

    return data
      .filter((item) => wheres.every(([whereKey, whereValue]) => item.get(whereKey) === whereValue))
      .map((item) => item.get(fieldName));
  }

  // -- observer

  addEventListener(event, listener) {
    const listeners = this.listeners.get(event);
    listeners.push(listener);
  }

  notify(event, data) {
    const listeners = this.listeners.get(event);
    listeners.forEach((listener) => listener(data));
  }
}
