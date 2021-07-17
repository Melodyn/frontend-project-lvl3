import i18next from 'i18next';
import resources from './locales/index.js';
import App from './components/App.js';

const run = async (body) => {
  const state = {
    lng: 'ru',
  };

  const i18n = i18next.createInstance();
  const t = i18n.t.bind(i18n);

  return i18n
    .init({ lng: 'ru', debug: true, resources })
    .then(() => {
      const app = new App(t);
      app.init(state);
      app.render(body);
    });
};

export default run;
