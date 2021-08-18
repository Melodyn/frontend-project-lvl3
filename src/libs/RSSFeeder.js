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
    throw new AppError('parsing', err);
  }
};

const validate = (url, urls) => yup
  .string()
  .url('validation.url')
  .notOneOf(urls, 'validation.unique')
  .required('validation.url')
  .validate(url)
  .then(() => null)
  .catch((e) => ({ isError: true, errorType: e.message }));

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
    const load = () => this.httpClient.get(link)
      .then((rawData) => this.parse(rawData))
      .then((parsedData) => {
        const feed = parsedData.get('channel');
        const feedPosts = Array.from(feed.get('items'));
        feed.delete('items');

        const feedId = this.idGen();
        feed.set('id', feedId);
        feed.set('feed', link);

        feedPosts.forEach((post) => post.set('id', this.idGen()));
        feedPosts.forEach((post) => post.set('feedId', feedId));

        return { feed, feedPosts };
      })
      .catch((err) => {
        if (!(err instanceof AppError)) {
          console.error(err);
          return { isError: true, errorType: 'loading' };
        }

        return { isError: true, errorType: err.errorType };
      });

    return validate(link, urls)
      .then((error) => (error || load()));
  }

  enableAutoSync(feeds, posts, cb) {
    this.autoSyncState = 'run';

    const sync = () => {
      setTimeout(() => ((this.autoSyncState === 'run')
        ? this.updatePosts(feeds, posts)
          .then((result) => {
            if (!result.isError) {
              cb(result);
            }
            return sync();
          })
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
      throw new AppError('parsing');
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
        .then((parsedData) => {
          const allPosts = Array.from(parsedData.get('channel').get('items'));
          const newPosts = allPosts.filter((post) => !feedPosts.includes(post.get('title')));

          return newPosts.map((post) => post.set('feedId', feedId));
        });
    });

    return Promise.all(newPostPromises).then((newPosts) => newPosts.flat());
  }
}
