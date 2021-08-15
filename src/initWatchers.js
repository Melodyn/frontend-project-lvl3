import onChange from 'on-change';

const initWatchers = (initState, app) => {
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

  const state = onChange(initState, (path, allData, previousData, newData) => {
    switch (path) {
      case 'app.state':
      case 'uiState.form.state':
        return formHandler();
      case 'posts':
        return reader.posts.renderPosts(newData.args, state);
      case 'uiState.reader.visitedPosts':
        return reader.posts.renderVisitedPost(newData.args);
      case 'feeds':
        return reader.feeds.render(newData.args);
      case 'uiState.reader.isHidden':
        return reader.render();
      default:
        return false;
    }
  });

  return state;
};

export default initWatchers;
