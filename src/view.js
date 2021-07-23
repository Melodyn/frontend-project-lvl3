import onChange from 'on-change';

const view = (initState, app) => {
  const { header: { form }, reader } = app;

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

  const readerHandler = () => {
    reader.render();
  };

  return onChange(initState, (path) => {
    if (path === 'uiState.form.state') formHandler();
    if (path === 'feedsUpdateTimestamp') readerHandler();
  });
};

export default view;
