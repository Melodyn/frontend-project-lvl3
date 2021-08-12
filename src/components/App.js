import Header from './Header.js';
import Reader from './Reader.js';

const getElements = () => ({
  html: document.querySelector('html'),
  title: document.querySelector('title'),
  body: document.querySelector('body'),
});

// ----

export default class App {
  constructor(services) {
    this.i18n = services.i18n;
    this.header = new Header(services);
    this.reader = new Reader(services);
    this.elements = {
      ...getElements(),
      header: this.header.elements,
      reader: this.reader.elements,
      modal: this.reader.posts.modal.elements,
    };
  }

  init(state) {
    this.header.init(state);
    this.reader.init(state);

    this.elements.title.textContent = this.i18n.t('appName');
    this.elements.html.setAttribute('lang', state.app.lng);
    this.elements.body.append(
      this.elements.modal.container,
      this.elements.header.container,
      this.elements.reader.container,
    );

    state.app.state = 'started';
  }
}
