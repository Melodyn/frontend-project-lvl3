import * as bootstrap from 'bootstrap';
import createElement from '../libs/createElement.js';

const elements = {
  container: createElement('div', {
    id: 'modal',
    tabindex: -1,
    'aria-labelledby': 'modal',
    'aria-hidden': true,
    classes: ['modal', 'fade'],
  }),
  // body
  dialogContainer: createElement('div', {
    classes: ['modal-dialog'],
  }),
  contentContainer: createElement('div', {
    classes: ['modal-content'],
  }),
  headerContainer: createElement('div', {
    classes: ['modal-header'],
  }),
  bodyContainer: createElement('div', {
    classes: ['modal-body'],
  }),
  footerContainer: createElement('div', {
    classes: ['modal-footer'],
  }),
  // text
  title: createElement('h5', {
    classes: ['modal-title'],
  }),
  description: createElement('p'),
  // buttons
  buttonClose: createElement('button', {
    type: 'button',
    'data-bs-dismiss': 'modal',
    classes: ['btn', 'btn-secondary'],
  }),
  buttonRead: createElement('a', {
    href: '',
    target: '_blank',
    classes: ['btn', 'btn-primary'],
  }),
};

export default class Modal {
  constructor(services) {
    this.i18n = services.i18n;
    this.elements = elements;
    this.modal = null;
  }

  init() {
    this.elements.headerContainer.append(this.elements.title);
    this.elements.bodyContainer.append(this.elements.description);
    this.elements.footerContainer.append(this.elements.buttonClose, this.elements.buttonRead);
    this.elements.contentContainer.append(
      this.elements.headerContainer,
      this.elements.bodyContainer,
      this.elements.footerContainer,
    );
    this.elements.dialogContainer.append(this.elements.contentContainer);
    this.elements.container.append(this.elements.dialogContainer);

    this.modal = new bootstrap.Modal(this.elements.container);
  }

  render(title, description, link) {
    this.elements.buttonRead.textContent = this.i18n.t('button.read');
    this.elements.buttonClose.textContent = this.i18n.t('button.close');
    this.elements.title.textContent = title;
    this.elements.description.textContent = description;
    this.elements.buttonRead.href = link;
  }
}
