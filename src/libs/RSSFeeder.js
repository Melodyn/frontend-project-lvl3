import * as yup from 'yup';
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

const validate = (url, urls) => yup
  .object({
    url: yup.string().url().required(),
    unique: yup.mixed().notOneOf(urls, 'Url not unique').required(),
  })
  .validate({ url, unique: url })
  .catch((err) => {
    throw new AppError(err.message, `validation.${err.path}`);
  });

// ----

export default class RSSFeeder {
  constructor(params = {}) {
    this.syncPeriod = params.RSS_SYNC_PERIOD;
    this.autoSyncState = 'stop';

    this.idGen = idGen();
    this.httpClient = createHTTPClient(params);

    this.parser = new DOMParser();
    this.listeners = new Map([
      ['add.feeds', []],
      ['add.posts', []],
    ]);
  }

  addByUrl(link, feeds) {
    const urls = feeds.map((feed) => feed.get('feed'));

    return validate(link, urls)
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

  addEventListener(event, listener) {
    const listeners = this.listeners.get(event);
    listeners.push(listener);
  }

  enableAutoSync(feeds, posts) {
    this.autoSyncState = 'run';

    const sync = () => {
      setTimeout(() => ((this.autoSyncState === 'run')
        ? this.updatePosts(feeds, posts)
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
    const parserError = document.querySelector('parsererror');
    if (parserError !== null) {
      throw new AppError('Data format is not RSS', 'parsing');
    }
    const channelEl = document.querySelector('channel');

    const parsedFeed = rssToObj(channelEl);
    const channel = parsedFeed.get('channel');
    if (!channel.has('items')) {
      channel.set('items', []);
    }

    return parsedFeed;
  }

  updatePosts(feeds, posts) {
    const newPostPromises = feeds.map((feed) => {
      const feedLink = feed.get('feed');
      const feedId = feed.get('id');
      const feedPosts = posts
        .filter((post) => post.get('feedId') === feedId)
        .map((post) => post.get('title'));

      return this.httpClient.get(feedLink)
        .then((rawData) => this.parse(rawData))
        .then((parsedData) => Array.from(parsedData.get('channel').get('items')))
        .then((allPosts) => allPosts.filter((post) => !feedPosts.includes(post.get('title'))))
        .then((newPosts) => this.insert('posts', newPosts, { feedId }));
    });

    return Promise.all(newPostPromises);
  }

  insert(repositoryName, data, extraFields = {}) {
    const extraFieldsEntries = Object.entries(extraFields);
    data.forEach((item) => {
      item.set('id', this.idGen());
      extraFieldsEntries.forEach(([key, value]) => item.set(key, value));
    });

    this.notify(`add.${repositoryName}`, data);

    return data;
  }

  notify(event, data) {
    const listeners = this.listeners.get(event);
    listeners.forEach((listener) => listener(data));
  }
}
