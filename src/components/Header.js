import createElement from '../libs/createElement.js';
import Form from './Form.js';

const getElements = () => ({
  container: createElement('div', {
    classes: ['container', 'py-5'],
  }),
  appName: createElement('h1', { classes: ['mb-3'] }),
});

export default class Header {
  constructor(services) {
    this.i18n = services.i18n;
    this.form = new Form(services);
    this.elements = {
      ...getElements(),
      form: this.form.elements,
    };
  }

  init(view) {
    this.form.init(view);

    this.elements.appName.textContent = this.i18n.t('appName');
    this.elements.container.append(this.elements.appName, this.elements.form.form);
  }
}
