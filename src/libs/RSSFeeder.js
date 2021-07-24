import createHTTPClient from './createHTTPClient.js';
import AppError from '../AppError.js';

const rssToObj = (rootElement) => {
  const iter = (element, accum) => {
    const key = element.tagName;
    const value = (element.children.length === 0)
      ? element.textContent
      : Array.from(element.children).reduce((acc, item) => iter(item, acc), new Map());

    if (key === 'item') {
      const items = accum.has('items') ? accum.get('items') : [];
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
    this.feeds = new Map();
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
    return validate(link, this.feeds)
      .then(() => this.httpClient.get(link, fakeMode))
      .then((rawData) => this.parse(rawData))
      .then((parsedData) => {
        const items = Array.from(parsedData.get('channel').get('items'));
        const guids = items.map((item) => item.get('guid'));
        this.state.loadedFeedsMap.set(link, guids);
        return parsedData;
      })
      .then((parsedData) => this.feeds.set(link, parsedData))
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

  parse(data) {
    const document = this.parser.parseFromString(data, 'text/xml');
    const { documentElement: { tagName } } = document;
    if (tagName !== 'rss') {
      throw new AppError(`Data format is not RSS, is ${tagName}`, 'parsing');
    }
    const channelEl = document.querySelector('channel');

    return rssToObj(channelEl);
  }

  updatePosts() {
    const newPostPromises = Array.from(this.state.loadedFeedsMap)
      .map(([feedLink, loadedPostGuids]) => this.httpClient
        .get(feedLink, this.state.fakeMode)
        .then((rawData) => this.parse(rawData))
        .then((parsedData) => {
          const items = Array.from(parsedData.get('channel').get('items'));
          return items.filter((item) => !loadedPostGuids.includes(item.get('guid')));
        })
        .then((newPosts) => {
          if (newPosts.length > 0) {
            const newPostGuids = Array.from(newPosts).map((item) => item.get('guid'));
            const feed = this.feeds.get(feedLink);
            const feedItems = feed.get('channel').get('items');
            feedItems.push(...newPosts);
            loadedPostGuids.push(...newPostGuids);

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
