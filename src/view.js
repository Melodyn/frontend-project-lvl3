import onChange from 'on-change';

const view = (initState, app) => {
  const { form } = app.header;

  const formHandler = () => {
    const { state, errorStep } = initState.uiState.form;
    switch (state) {
      case 'ready':
      case 'success':
        return form.renderEmpty(state);
      case 'validation':
      case 'loading':
        return form.renderProcess(state);
      case 'error':
        return form.renderError(errorStep);
      default:
        throw new Error(`Unexpected state "${state}"`);
    }
  };

  return onChange(initState, (path) => {
    if (path === 'uiState.form.state') formHandler();
  });
};

export default view;
