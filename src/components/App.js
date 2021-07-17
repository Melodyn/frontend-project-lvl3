import Header from './Header.js';

const htmlEl = document.querySelector('html');
const titleEl = document.querySelector('title');

export default class App {
  constructor(t) {
    this.t = t;
    this.header = new Header(t);
  }

  init(state) {
    htmlEl.setAttribute('lang', state.lng);
    titleEl.textContent = this.t('appName');
  }

  render(body) {
    this.header.init();
    const { headerContainer, rssForm } = this.header.getElements();

    body.append(headerContainer);

    rssForm.input.focus();
  }
}
