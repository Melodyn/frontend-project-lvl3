import { createElement } from '../helpers.js';

export const rssFormEl = createElement('form');

export const inputGroupEl = createElement('div', {
  classes: ['input-group', 'input-group-lg', 'py-2'],
});
export const inputEl = createElement('input', {
  id: 'url',
  name: 'url',
  type: 'url',
  required: true,
  class: 'form-control',
  'aria-describedby': 'url-add',
});
export const buttonEl = createElement('button', {
  id: 'url-add',
  type: 'submit',
  classes: ['btn', 'btn-primary'],
}, 'Добавить');

export const formTextsGroupEl = createElement('div', { class: 'row' });
export const formExampleEl = createElement('p', {
  classes: ['col', 'fw-bold', 'text-break', 'text-secondary'],
}, 'Пример: ');
export const formExampleLinkEl = createElement('span',
  { class: 'user-select-all' },
  'https://ru.hexlet.io/lessons.rss');
export const formStatusEl = createElement('p', {
  classes: ['col', 'me-1', 'text-break', 'text-success', 'text-end'],
}, 'Готов к работе');

formExampleEl.append(formExampleLinkEl);
formTextsGroupEl.append(formExampleEl, formStatusEl);
inputGroupEl.append(inputEl, buttonEl);
rssFormEl.append(inputGroupEl, formTextsGroupEl);

export default rssFormEl;
