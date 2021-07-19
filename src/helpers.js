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

export const createParser = () => {
  const parser = new DOMParser();
  return (data) => {
    const result = parser.parseFromString(data, 'text/xml');
    if (result.documentElement.tagName !== 'rss') {
      throw new Error(`Data format is not RSS, is ${result.documentElement.tagName}`);
    }
    const channelEl = result.querySelector('channel');
    const channelTitleEl = channelEl.querySelector('title');
    const channelDescEl = channelEl.querySelector('description');

    return {
      name: channelTitleEl.textContent,
      description: channelDescEl.textContent,
      items: [],
    };
  };
};
