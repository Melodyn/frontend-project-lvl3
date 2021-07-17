import { createElement } from '../helpers.js';

const elements = {
  form: createElement('form'),

  inputGroup: createElement('div', {
    classes: ['input-group', 'input-group-lg', 'py-2'],
  }),
  input: createElement('input', {
    id: 'url',
    name: 'url',
    type: 'url',
    required: true,
    class: 'form-control',
    'aria-describedby': 'url-add',
  }),
  button: createElement('button', {
    id: 'url-add',
    type: 'submit',
    classes: ['btn', 'btn-primary'],
  }),

  formTextsGroup: createElement('div', { class: 'row' }),
  formExample: createElement('p', {
    classes: ['col', 'fw-bold', 'text-break', 'text-secondary'],
  }),
  formExampleLink: createElement('span', { class: 'user-select-all' }),
  formStatus: createElement('p', {
    classes: ['col', 'me-1', 'text-break', 'text-success', 'text-end'],
  }),
};

// ----

export default class RssForm {
  constructor(t) {
    this.t = t;
    this.elements = elements;
  }

  init() {
    this.elements.button.textContent = this.t('button.urlAdd');
    this.elements.input.setAttribute('placeholder', this.t('form.inputPlaceholder'));
    this.elements.formExample.textContent = this.t('form.exampleText');
    this.elements.formExampleLink.textContent = this.t('form.exampleLink');
    this.elements.formStatus.textContent = this.t('form.status.ready');

    this.elements.formExample.append(this.elements.formExampleLink);
    this.elements.formTextsGroup.append(this.elements.formExample, this.elements.formStatus);
    this.elements.inputGroup.append(this.elements.input, this.elements.button);
    this.elements.form.append(this.elements.inputGroup, this.elements.formTextsGroup);

    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.elements.form.reset();
    });
  }

  getElements() {
    return this.elements;
  }

  // render() {
  // }
}
