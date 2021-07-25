import axios from 'axios';
import AppError from '../AppError.js';

const createHTTPClient = (params = {}) => {
  const baseURL = params.RSS_PROXY_URL;
  const httpClient = axios.create({ baseURL, params: { disableCache: true } });

  const get = (url) => httpClient.get('/get', { params: { url } })
    .then(({ data }) => data.contents)
    .catch((err) => {
      throw new AppError(err, 'loading');
    });

  return { get };
};

export default createHTTPClient;
