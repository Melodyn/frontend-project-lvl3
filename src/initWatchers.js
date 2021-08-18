import onChange from 'on-change';

const initWatchers = (initState, app) => {
  const { header: { form }, reader } = app;

  const formHandler = () => {
    const { state, errorType } = initState.form;
    switch (state) {
      case 'ready':
      case 'success':
        form.renderEmpty(state);
        break;
      case 'processing':
        form.renderProcess();
        break;
      case 'error':
        form.renderError(errorType);
        break;
      default:
        throw new Error(`Unexpected form state "${state}"`);
    }
  };

  const state = onChange(initState, (path, allData, previousData, newData) => {
    switch (path) {
      case 'app.state':
      case 'form.state':
        formHandler();
        break;
      case 'posts':
        reader.posts.renderPosts(newData.args, state);
        break;
      case 'uiState.modal.visitedPostId':
        reader.posts.renderVisitedPost(allData, state);
        break;
      case 'feeds':
        reader.feeds.render(newData.args);
        break;
      default:
        break;
    }
  });

  return state;
};

export default initWatchers;
