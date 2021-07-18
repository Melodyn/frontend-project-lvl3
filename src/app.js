import i18next from 'i18next';
import resources from './locales/index.js';
import App from './components/App.js';

const run = async (body) => {
  const state = {
    app: {
      env: process.env.NODE_ENV,
      isProd: (process.env.NODE_ENV === 'production'),
      lng: 'ru',
    },
  };

  const i18n = i18next.createInstance();
  const t = i18n.t.bind(i18n);

  return i18n
    .init({ lng: state.app.lng, debug: !state.app.isProd, resources })
    .then(() => {
      const app = new App(t);
      app.init(state);
      app.render(body);
    });
};

export default run;
