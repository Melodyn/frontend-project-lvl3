export const createElement = (name, attributes = {}, textContent = '') => {
  const defaultAttributes = { classes: [] };
  const allAttributes = { ...defaultAttributes, ...attributes };
  const { classes, ...otherAttributes } = allAttributes;

  const element = document.createElement(name);
  element.textContent = textContent;
  if (classes.length > 0) element.classList.add(...classes);
  Object.entries(otherAttributes).forEach(([key, value]) => element.setAttribute(key, value));

  return element;
};

export const noop = () => {};
