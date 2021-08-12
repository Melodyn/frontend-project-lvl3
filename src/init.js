import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import resources from './locales/index.js';
import initWatchers from './initWatchers.js';
import App from './components/App.js';
import RSSFeeder from './libs/RSSFeeder.js';

const init = () => {
  const config = {
    NODE_ENV: process.env.NODE_ENV,
    RSS_SYNC_PERIOD: 5000,
    RSS_PROXY_URL: 'https://hexlet-allorigins.herokuapp.com',
    RSS_PROXY_URL_PARAMS: { disableCache: true },
  };
  const isProd = (config.NODE_ENV === 'production');

  const initState = {
    app: {
      state: 'init',
      lng: 'ru',
    },
    newFeeds: [],
    newPosts: [],
    uiState: {
      form: {
        state: 'ready',
        errorType: null,
      },
      reader: {
        isHidden: true,
        visitedPostId: null,
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
      rssFeeder.enableAutoSync();
    });
};

export default init;
