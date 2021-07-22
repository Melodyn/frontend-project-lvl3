import axios from 'axios';
import AppError from '../AppError.js';
import fixtures from '../../__fixtures__/rss.js';

const createHTTPClient = (params = {}) => {
  const baseURL = params.RSS_PROXY_URL;
  const httpClient = axios.create({ baseURL });

  const realClient = (url) => httpClient.get('/get', { params: { url } })
    .then(({ data }) => data.contents)
    .catch((err) => {
      throw new AppError(err, 'loading');
    });
  const fakeClient = async (url) => (url.includes('rss')
    ? fixtures.valid
    : fixtures.invalid);

  return {
    get: (url, fakeMode = false) => (fakeMode ? fakeClient(url) : realClient(url)),
  };
};

export default createHTTPClient;
