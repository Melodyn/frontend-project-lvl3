import Header from './Header.js';

const elements = {
  html: document.querySelector('html'),
  title: document.querySelector('title'),
  body: document.querySelector('body'),
};

export default class App {
  constructor(t) {
    this.t = t;
    this.header = new Header(t);
    this.elements = {
      ...elements,
      header: this.header.elements,
    };
  }

  init(view) {
    this.header.init(view);

    this.elements.title.textContent = this.t('appName');
    this.elements.html.setAttribute('lang', view.app.lng);
    this.elements.body.append(this.elements.header.container);
  }
}
