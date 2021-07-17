import { createElement } from '../helpers.js';
import headerForm from './headerForm.js';

const headerContainerEl = createElement('div', {
  classes: ['container', 'py-5'],
});

headerContainerEl.append(headerForm);

export default headerContainerEl;
