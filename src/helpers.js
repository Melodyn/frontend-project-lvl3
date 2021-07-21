import axios from 'axios';
import AppError from './AppError.js';

export const createElement = (name, attributes = {}, textContent = '') => {
  const defaultAttributes = { classes: [] };
  const allAttributes = { ...defaultAttributes, ...attributes };
  const { classes, ...otherAttributes } = allAttributes;

  const element = document.createElement(name);
  element.textContent = textContent;
  if (classes.length > 0) element.classList.add(...classes);
  Object.entries(otherAttributes).forEach(([key, value]) => element.setAttribute(key, value));

  return element;
};

// RSS Feeder

const fixtures = {
  valid: '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title><![CDATA[Lorem ipsum feed for an interval of 1 minutes with 10 item(s)]]></title><description><![CDATA[This is a constantly updating lorem ipsum feed]]></description><link>http://example.com/</link><generator>RSS for Node</generator><lastBuildDate>Mon, 19 Jul 2021 15:38:12 GMT</lastBuildDate><pubDate>Mon, 19 Jul 2021 15:38:00 GMT</pubDate><copyright><![CDATA[Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.]]></copyright><ttl>1</ttl><item><title><![CDATA[Lorem ipsum 2021-07-19T15:38:00Z]]></title><description><![CDATA[Id veniam in sint cupidatat cillum dolor proident.]]></description><link>http://example.com/test/1626709080</link><guid isPermaLink="true">http://example.com/test/1626709080</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:38:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:37:00Z]]></title><description><![CDATA[Sit ipsum exercitation magna minim.]]></description><link>http://example.com/test/1626709020</link><guid isPermaLink="true">http://example.com/test/1626709020</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:37:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:36:00Z]]></title><description><![CDATA[Consequat culpa eiusmod amet irure excepteur dolor sit amet.]]></description><link>http://example.com/test/1626708960</link><guid isPermaLink="true">http://example.com/test/1626708960</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:36:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:35:00Z]]></title><description><![CDATA[Veniam non ex eu elit ad esse nisi aliquip.]]></description><link>http://example.com/test/1626708900</link><guid isPermaLink="true">http://example.com/test/1626708900</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:35:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:34:00Z]]></title><description><![CDATA[Dolor sit ut consectetur eu elit laboris labore Lorem est nisi id laborum laborum deserunt.]]></description><link>http://example.com/test/1626708840</link><guid isPermaLink="true">http://example.com/test/1626708840</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:34:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:33:00Z]]></title><description><![CDATA[Laboris magna eu laborum do enim dolore fugiat anim cupidatat ipsum.]]></description><link>http://example.com/test/1626708780</link><guid isPermaLink="true">http://example.com/test/1626708780</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:33:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:32:00Z]]></title><description><![CDATA[In ipsum enim excepteur eiusmod tempor nostrud ullamco magna quis.]]></description><link>http://example.com/test/1626708720</link><guid isPermaLink="true">http://example.com/test/1626708720</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:32:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:31:00Z]]></title><description><![CDATA[Voluptate exercitation adipisicing proident non elit voluptate reprehenderit nulla.]]></description><link>http://example.com/test/1626708660</link><guid isPermaLink="true">http://example.com/test/1626708660</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:31:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:30:00Z]]></title><description><![CDATA[Occaecat deserunt occaecat ad ipsum id ullamco dolore ullamco sunt ea ad aliqua.]]></description><link>http://example.com/test/1626708600</link><guid isPermaLink="true">http://example.com/test/1626708600</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:30:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:29:00Z]]></title><description><![CDATA[Consequat qui nostrud mollit laboris veniam eiusmod qui do.]]></description><link>http://example.com/test/1626708540</link><guid isPermaLink="true">http://example.com/test/1626708540</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:29:00 GMT</pubDate></item></channel></rss>',
  invalid: 'hello, world',
};

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

  return iter(rootElement, {});
};

const createParser = () => {
  const parser = new DOMParser();
  return (data) => {
    const result = parser.parseFromString(data, 'text/xml');
    if (result.documentElement.tagName !== 'rss') {
      throw new AppError(`Data format is not RSS, is ${result.documentElement.tagName}`, 'parsing');
    }
    const channelEl = result.querySelector('channel');

    return rssToObj(channelEl);
  };
};

const createHTTPClient = () => {
  const httpClient = axios.create({
    baseURL: 'https://hexlet-allorigins.herokuapp.com',
  });

  return {
    get: (url) => httpClient.get('/get', { params: { url } }),
  };
};

export const createRSSFeeder = () => {
  const feeds = new Map();
  const httpClient = createHTTPClient();
  const parse = createParser();

  const validate = async (link) => {
    let url;

    try {
      url = (new URL(link)).toString(); // validation
    } catch (err) {
      throw new AppError(err, 'validation.url');
    }

    if (feeds.has(url)) {
      throw new AppError('Url not unique', 'validation.unique');
    }
  };

  const load = async (link) => validate(link)
    .then(() => httpClient.get(link))
    .then((res) => res.data.contents)
    .catch((err) => {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(err, 'loading');
    });

  const addByUrl = (link) => load(link)
    .then((rawData) => parse(rawData))
    .then((parsedData) => {
      console.log(parsedData);
      feeds.set(link, parsedData);
    });

  const emulateAddByUrl = (link) => new Promise((resolve, reject) => {
    setTimeout(() => {
      validate(link)
        .then(() => {
          setTimeout(() => {
            try {
              const data = link.includes('rss') ? fixtures.valid : fixtures.invalid;
              const parsedData = parse(data);
              console.log(parsedData);
              feeds.set(link, parsedData);
              resolve();
            } catch (err) {
              reject(err);
            }
          }, 2000);
        })
        .catch((err) => reject(err));
    }, 2000);
  });

  return {
    addByUrl: (link, devMode = false) => (devMode ? emulateAddByUrl(link) : addByUrl(link)),
  };
};
