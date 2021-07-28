import createHTTPClient from './createHTTPClient.js';
import AppError from '../AppError.js';

const idGen = () => {
  let start = 0;
  return () => {
    start += 1;
    return start;
  };
};

const rssToObj = (rootElement, feed) => {
  const iter = (element, accum) => {
    const key = element.tagName;
    const value = (element.children.length === 0)
      ? element.textContent
      : Array.from(element.children).reduce((acc, item) => iter(item, acc), new Map());

    if (key === 'item') {
      const items = accum.has('items') ? accum.get('items') : [];
      value.set('feed', feed);
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

const rssToJSON = (rootElement, feed) => {
  const iter = (element, accum) => {
    const key = element.tagName;
    const value = (element.children.length === 0)
      ? element.textContent
      : Array.from(element.children).reduce((acc, item) => iter(item, acc), {});

    if (key === 'item') {
      const items = accum.items || [];
      value.feed = feed;
      items.push(value);
      accum.items = items;
    } else {
      accum[key] = value;
    }

    return accum;
  };

  try {
    return iter(rootElement, {});
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
      ['add.feed', []],
      ['add.posts', []],
    ]);
  }

  validateSync(link) {
    const feeds = this.sources.get('feeds');
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
  }

  addByUrl(link) {
    const feeds = this.sources.get('feeds');
    const posts = this.sources.get('posts');

    return validate(link, feeds)
      .then(() => this.httpClient.get(link))
      .then((rawData) => {
        const parsedData = this.parse(rawData, link, true);
        console.log('---> rawData', rawData);
        console.log('---> parsedData', JSON.stringify(parsedData, null, 1));
        return this.parse(rawData, link);
      })
      .then((parsedData) => {
        const feed = parsedData.get('channel');
        const feedPosts = Array.from(feed.get('items'));

        return [feed, feedPosts];
      })
      .then(([feed, feedPosts]) => {
        const feedId = this.idGen();
        const processedPosts = feedPosts.map((post) => {
          post.set('id', this.idGen());
          post.set('feedId', feedId);
          return post;
        });

        posts.push(...processedPosts);
        feeds.push(feed);
        feed.delete('items');
        feed.set('feed', link);
        feed.set('id', feedId);

        return [feed, processedPosts];
      })
      .then(([feed, feedPosts]) => {
        this.notify('add.feed', feed);
        this.notify('add.posts', feedPosts);
      })
      .then(() => true);
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

  parse(data, feed, isJSON = false) {
    const document = this.parser.parseFromString(data, 'text/xml');
    const { documentElement: { tagName } } = document;
    if (tagName !== 'rss') {
      throw new AppError(`Data format is not RSS, is ${tagName}`, 'parsing');
    }
    const channelEl = document.querySelector('channel');

    const parsedFeed = isJSON ? rssToJSON(channelEl, feed) : rssToObj(channelEl, feed);
    if (isJSON) return parsedFeed;
    const channel = parsedFeed.get('channel');
    if (!channel.has('items')) {
      channel.set('items', []);
    }
    return parsedFeed;
  }

  updatePosts() {
    const feeds = this.sources.get('feeds');
    const posts = this.sources.get('posts');
    const postGuidsByFeeds = posts.reduce((acc, post) => {
      const feed = post.get('feed');
      const guid = post.get('guid');
      if (acc.has(feed)) {
        acc.get(feed).push(guid);
      } else {
        acc.set(feed, [guid]);
      }
      return acc;
    }, new Map());

    const newPostPromises = feeds.map((feed) => {
      const feedLink = feed.get('feed');
      const feedId = feed.get('id');

      return this.httpClient.get(feedLink)
        .then((rawData) => this.parse(rawData, feedLink))
        .then((parsedData) => Array.from(parsedData.get('channel').get('items')))
        .then((allPosts) => {
          const postGuidsInFeed = postGuidsByFeeds.get(feedLink);
          return allPosts.filter((post) => !postGuidsInFeed.includes(post.get('guid')));
        })
        .then((newPosts) => newPosts.map((post) => {
          post.set('id', this.idGen());
          post.set('feedId', feedId);
          return post;
        }))
        .then((newPosts) => {
          if (newPosts.length > 0) {
            posts.push(...newPosts);
            this.notify('add.posts', newPosts);
            return true;
          }
          return false;
        });
    });

    return Promise.all(newPostPromises);
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
