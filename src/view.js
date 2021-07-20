import onChange from 'on-change';

const view = (initState, app) => {
  const { form } = app.header;

  const formHandler = () => {
    const { state, errorType } = initState.uiState.form;
    switch (state) {
      case 'ready':
      case 'success':
        return form.renderEmpty(state);
      case 'processing':
        return form.renderProcess();
      case 'error':
        return form.renderError(errorType);
      default:
        throw new Error(`Unexpected form state "${state}"`);
    }
  };

  return onChange(initState, (path) => {
    if (path === 'uiState.form.state') formHandler();
  });
};

export default view;
