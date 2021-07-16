import 'bootstrap/dist/css/bootstrap.min.css';

const createElement = (name, attributes = {}, textContent = '') => {
  const defaultAttributes = { classes: [] };
  const allAttributes = { ...defaultAttributes, ...attributes };
  const { classes, ...otherAttributes } = allAttributes;

  const element = document.createElement(name);
  element.textContent = textContent;
  if (classes.length > 0) element.classList.add(...classes);
  Object.entries(otherAttributes).forEach(([key, value]) => element.setAttribute(key, value));

  return element;
};

const containerEl = createElement('div', { class: 'container' });
const col1El = createElement('div', { class: 'col' });
const col2El = createElement('div', { class: 'col' });
const rssFormEl = createElement('form', { class: 'row' });
const rssInputEl = createElement('input', {
  id: 'url',
  class: 'form-control',
  name: 'url',
  type: 'text',
});
const rssButtonEl = createElement('button', {
  type: 'button',
  classes: ['btn', 'btn-primary'],
}, 'Добавить');

col1El.append(rssInputEl);
col2El.append(rssButtonEl);
rssFormEl.append(col1El, col2El);
containerEl.append(rssFormEl);
document.body.append(containerEl);
