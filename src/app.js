import i18next from 'i18next';
import resources from './locales/index.js';
import initView from './view.js';
import App from './components/App.js';

const run = async () => {
  const state = {
    app: {
      env: process.env.NODE_ENV,
      isProd: (process.env.NODE_ENV === 'production'),
      lng: 'ru',
    },
    streams: new Map([]),
    uiState: {
      form: {
        state: 'ready',
        errorStep: null,
      },
    },
  };

  const i18n = i18next.createInstance();
  const t = i18n.t.bind(i18n);

  return i18n
    .init({ lng: state.app.lng, debug: !state.app.isProd, resources })
    .then(() => {
      const app = new App(t);
      const view = initView(state, app);
      app.init(view);
      app.header.form.renderEmpty();
    });
};

export default run;
