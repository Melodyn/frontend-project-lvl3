import Header from './Header.js';
import Reader from './Reader.js';

const elements = {
  html: document.querySelector('html'),
  title: document.querySelector('title'),
  body: document.querySelector('body'),
};

export default class App {
  constructor(services) {
    this.t = services.i18n;
    this.header = new Header(services);
    this.reader = new Reader(services);
    this.elements = {
      ...elements,
      header: this.header.elements,
      reader: this.reader.elements,
    };
  }

  init(view) {
    this.header.init(view);
    this.reader.init(view);

    this.elements.title.textContent = this.t('appName');
    this.elements.html.setAttribute('lang', view.app.lng);
    this.elements.body.append(
      this.elements.header.container,
      this.elements.reader.container,
    );
  }
}
