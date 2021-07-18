import { createElement } from '../helpers.js';
import Form from './Form.js';

const elements = {
  container: createElement('div', {
    classes: ['container', 'py-5'],
  }),
  appName: createElement('h1', { class: 'mb-3' }),
};

export default class Header {
  constructor(t) {
    this.t = t;
    this.form = new Form(t);
    this.elements = elements;
  }

  init() {
    this.elements.appName.textContent = this.t('appName');

    this.form.init();
    const formEls = this.form.getElements();
    this.elements.form = formEls;
    this.elements.container.append(this.elements.appName, formEls.form);
  }

  getElements() {
    return this.elements;
  }
}
