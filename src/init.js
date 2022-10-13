import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import resources from './locales/index.js';
import initWatchers from './initWatchers.js';
import App from './components/App.js';
import RSSFeeder from './libs/RSSFeeder.js';

const config = {
  NODE_ENV: process.env.NODE_ENV,
  RSS_SYNC_PERIOD: 5000,
  RSS_PROXY_URL: 'https://allorigins.hexlet.app',
  RSS_PROXY_URL_PARAMS: { disableCache: true },
};
const isProd = (config.NODE_ENV === 'production');

const init = () => {
  const initState = {
    app: {
      state: 'init',
      lng: 'ru',
    },
    feeds: [],
    posts: [],
    form: {
      state: 'ready',
      errorType: null,
    },
    uiState: {
      modal: {
        visitedPostId: null,
      },
      reader: {
        visitedPosts: new Set(),
      },
    },
  };

  const i18n = i18next.createInstance();
  const rssFeeder = new RSSFeeder(config);

  return i18n
    .init({
      lng: initState.app.lng,
      debug: !isProd,
      resources,
    })
    .then(() => {
      const app = new App({
        i18n,
        rssFeeder,
      });
      const state = initWatchers(initState, app);
      app.init(state);
      rssFeeder.enableAutoSync(
        state.feeds,
        state.posts,
        (feedPosts) => state.posts.push(...(feedPosts.reverse())),
      );
    });
};

export default init;
