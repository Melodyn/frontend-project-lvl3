import createElement from '../libs/createElement.js';
import AppError from '../AppError.js';

const formStatusColors = ['text-primary', 'text-success', 'text-danger'];

const elements = {
  form: createElement('form'),

  inputGroup: createElement('div', {
    classes: ['input-group', 'input-group-lg', 'py-2'],
  }),
  input: createElement('input', {
    id: 'url-input',
    name: 'url',
    type: 'text',
    required: true,
    autofocus: true,
    'aria-label': 'url',
    classes: ['form-control'],
  }),
  button: createElement('button', {
    id: 'url-add',
    type: 'submit',
    'aria-label': 'add',
    classes: ['btn', 'btn-primary'],
  }),

  exampleContainer: createElement('p', {
    classes: ['ms-1', 'my-1', 'fw-bold', 'text-break', 'text-secondary'],
  }),
  exampleText: createElement('span'),
  exampleLink: createElement('span', { classes: ['user-select-all'] }),
  formStatus: createElement('p', {
    classes: ['me-1', 'mt-0', 'text-break', 'text-end'],
  }),
};

// ----

export default class Form {
  constructor(services) {
    this.i18n = services.i18n;
    this.rssFeeder = services.rssFeeder;
    this.elements = elements;
  }

  init(view) {
    this.elements.button.textContent = this.i18n.t('button.urlAdd');
    this.elements.input.setAttribute('placeholder', this.i18n.t('form.inputPlaceholder'));
    this.elements.exampleText.textContent = this.i18n.t('form.exampleText');
    this.elements.exampleLink.textContent = this.i18n.t('form.exampleLink');
    this.elements.formStatus.textContent = this.i18n.t('form.status.ready');

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
      if (!url) {
        console.log('--->', 'form', Array.from(form.keys()), Array.from(form.values()));
        return;
      }

      view.uiState.form.state = 'processing';

      try {
        this.rssFeeder.validateSync(url);
        console.log('--->', 'add', { url });
      } catch (err) {
        if (err instanceof AppError) {
          view.uiState.form.errorType = err.errorType;
        } else {
          console.error(err);
          view.uiState.form.errorType = 'loading';
        }
        console.log('--->', `error ${url}`, err.message);
        view.uiState.form.state = 'error';
        return;
      }

      this.rssFeeder.addByUrl(url)
        .then(() => {
          console.log('--->', `success ${url}`);
          view.uiState.form.errorType = null;
          view.uiState.form.state = 'success';
        })
        .catch((err) => {
          if (err instanceof AppError) {
            view.uiState.form.errorType = err.errorType;
          } else {
            console.error(err);
            view.uiState.form.errorType = 'loading';
          }
          console.log('--->', `error ${url}`, err.message);
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
    this.elements.formStatus.textContent = this.i18n.t(`form.status.${stateName}`);
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-success');
  }

  renderProcess() {
    this.elements.button.disabled = true;
    this.elements.input.disabled = true;
    this.elements.input.classList.remove('is-invalid');
    this.elements.formStatus.textContent = this.i18n.t('form.status.processing');
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-primary');
  }

  renderError(stepName) {
    this.elements.button.disabled = false;
    this.elements.input.disabled = false;
    this.elements.formStatus.textContent = this.i18n.t(`form.error.${stepName}`);
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-danger');
    this.elements.input.classList.add('is-invalid');
    this.elements.input.select();
    this.elements.input.focus();
  }
}
