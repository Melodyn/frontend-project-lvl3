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

  return onChange(initState, (path, value) => {
    switch (path) {
      case 'app.state':
      case 'uiState.form.state':
        return formHandler();
      case 'newPosts':
        return reader.posts.render(value);
      case 'newFeeds':
        return reader.feeds.render(value);
      case 'uiState.reader.isHidden':
        return reader.render();
      default:
        return false;
    }
  });
};

export default view;
