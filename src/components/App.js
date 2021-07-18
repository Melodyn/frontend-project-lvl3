import Header from './Header.js';

const htmlEl = document.querySelector('html');
const titleEl = document.querySelector('title');

export default class App {
  constructor(t) {
    this.t = t;
    this.header = new Header(t);
  }

  init(state) {
    htmlEl.setAttribute('lang', state.app.lng);
    titleEl.textContent = this.t('appName');
    this.header.init();
  }

  render(body) {
    const headerEls = this.header.getElements();

    body.append(headerEls.container);

    headerEls.form.input.focus();
  }
}
