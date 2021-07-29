import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import resources from './locales/index.js';
import initView from './initView.js';
import App from './components/App.js';
import RSSFeeder from './libs/RSSFeeder.js';

const run = () => {
  const config = {
    NODE_ENV: process.env.NODE_ENV,
    RSS_SYNC_PERIOD: 5000,
    RSS_PROXY_URL: 'https://hexlet-allorigins.herokuapp.com',
  };

  const state = {
    app: {
      state: 'init',
      isProd: (config.NODE_ENV === 'production'),
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
        visitedPost: {},
      },
    },
  };

  const i18n = i18next.createInstance();
  const rssFeeder = new RSSFeeder(config);

  return i18n
    .init({
      lng: state.app.lng,
      // debug: !state.app.isProd,
      debug: false,
      resources,
    })
    .then(() => {
      const app = new App({
        i18n,
        rssFeeder,
      });
      const view = initView(state, app);
      app.init(view);
      rssFeeder.enableAutoSync();
    });
};

export default run;
