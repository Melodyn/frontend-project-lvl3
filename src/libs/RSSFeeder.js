import createHTTPClient from './createHTTPClient.js';
import AppError from '../AppError.js';

const rssToObj = (rootElement) => {
  const iter = (element, accum) => {
    const key = element.tagName;
    const value = (element.children.length === 0)
      ? element.textContent
      : Array.from(element.children).reduce((acc, item) => iter(item, acc), {});

    if (key === 'item') {
      const items = accum.items || [];
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
  }

  parse(data) {
    const document = this.parser.parseFromString(data, 'text/xml');
    const { documentElement: { tagName } } = document;
    if (tagName !== 'rss') {
      throw new AppError(`Data format is not RSS, is ${tagName}`, 'parsing');
    }
    const channelEl = document.querySelector('channel');

    return rssToObj(channelEl);
  }

  addByUrl(link, fakeMode = false) {
    const { feeds } = this;

    return validate(link, feeds)
      .then(() => this.httpClient.get(link, fakeMode))
      .then((rawData) => this.parse(rawData))
      .then((parsedData) => feeds.set(link, parsedData))
      .then(() => true);
  }
}
