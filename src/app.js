import i18next from 'i18next';
import resources from './locales/index.js';
import initView from './view.js';
import App from './components/App.js';
import { createRSSFeeder } from './helpers.js';

const run = async () => {
  const state = {
    app: {
      env: process.env.NODE_ENV,
      isProd: (process.env.NODE_ENV === 'production'),
      lng: 'ru',
    },
    uiState: {
      form: {
        state: 'ready',
        errorType: null,
      },
    },
  };

  const i18n = i18next.createInstance();
  const t = i18n.t.bind(i18n);

  return i18n
    .init({ lng: state.app.lng, debug: !state.app.isProd, resources })
    .then(() => {
      const app = new App({
        i18n: t,
        rssFeeder: createRSSFeeder(),
      });
      const view = initView(state, app);
      app.init(view);
      app.header.form.renderEmpty();
    });
};

export default run;
