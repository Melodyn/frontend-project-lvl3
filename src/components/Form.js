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

  exampleContainer: createElement('p', {
    classes: ['ms-1', 'my-1', 'fw-bold', 'text-break', 'text-secondary'],
  }),
  exampleText: createElement('span'),
  exampleLink: createElement('span', { class: 'user-select-all' }),
  formStatus: createElement('p', {
    classes: ['me-1', 'mt-0', 'text-break', 'text-success', 'text-end'],
  }),
};

// ----

export default class Form {
  constructor(t) {
    this.t = t;
    this.elements = elements;
  }

  init() {
    this.elements.button.textContent = this.t('button.urlAdd');
    this.elements.input.setAttribute('placeholder', this.t('form.inputPlaceholder'));
    this.elements.exampleText.textContent = this.t('form.exampleText');
    this.elements.exampleLink.textContent = this.t('form.exampleLink');
    this.elements.formStatus.textContent = this.t('form.status.ready');

    this.elements.exampleContainer.append(this.elements.exampleText, this.elements.exampleLink);
    this.elements.inputGroup.append(this.elements.input, this.elements.button);
    this.elements.form.append(
      this.elements.exampleContainer,
      this.elements.inputGroup,
      this.elements.formStatus,
    );

    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.elements.form.reset();
      this.elements.input.focus();
    });
  }

  getElements() {
    return this.elements;
  }

  // render() {
  // }
}
