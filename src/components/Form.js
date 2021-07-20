import { createElement } from '../helpers.js';
import AppError from '../AppError.js';

const formStatusColors = ['text-primary', 'text-success', 'text-danger'];

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
    classes: ['me-1', 'mt-0', 'text-break', 'text-end'],
  }),
};

// ----

export default class Form {
  constructor(services) {
    this.t = services.i18n;
    this.elements = elements;
    this.rssFeeder = services.rssFeeder;
  }

  init(view) {
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
      const form = new FormData(e.target);
      const url = form.get('url');

      view.uiState.form.state = 'processing';

      // this.rssFeeder.addByUrl(url)
      this.rssFeeder.addByUrl(url, 'dev')
        .then(() => {
          view.uiState.form.errorType = null;
          view.uiState.form.state = 'success';
        })
        .catch((err) => {
          if (err instanceof AppError) {
            view.uiState.form.errorType = err.errorType;
          } else {
            view.uiState.form.errorType = 'loading';
          }
          view.uiState.form.state = 'error';
        });
    });
  }

  renderEmpty(stateName = 'ready') {
    this.elements.button.disabled = false;
    this.elements.input.disabled = false;
    this.elements.input.classList.remove('is-invalid');
    this.elements.form.reset();
    this.elements.input.focus();
    this.elements.formStatus.textContent = this.t(`form.status.${stateName}`);
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-success');
  }

  renderProcess() {
    this.elements.button.disabled = true;
    this.elements.input.disabled = true;
    this.elements.input.classList.remove('is-invalid');
    this.elements.formStatus.textContent = this.t('form.status.processing');
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-primary');
  }

  renderError(stepName) {
    this.elements.button.disabled = false;
    this.elements.input.disabled = false;
    this.elements.formStatus.textContent = this.t(`form.error.${stepName}`);
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-danger');
    this.elements.input.classList.add('is-invalid');
    this.elements.input.select();
    this.elements.input.focus();
  }
}
