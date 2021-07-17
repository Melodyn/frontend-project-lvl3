import { createElement } from '../helpers.js';
import RssForm from './RssForm.js';

const elements = {
  headerContainer: createElement('div', {
    classes: ['container', 'py-5'],
  }),
  appName: createElement('h1'),
};

export default class Header {
  constructor(t) {
    this.t = t;
    this.rssForm = new RssForm(t);
    this.elements = elements;
  }

  init() {
    this.elements.appName.textContent = this.t('appName');

    this.rssForm.init();
    const rssFormElements = this.rssForm.getElements();
    this.elements.rssForm = rssFormElements;
    this.elements.headerContainer.append(this.elements.appName, rssFormElements.form);
  }

  getElements() {
    return this.elements;
  }

  // render() {
  //   this.rssForm.render();
  // }
}
