import axios from 'axios';
import AppError from '../AppError.js';

const createHTTPClient = (config = {}) => {
  const baseURL = config.RSS_PROXY_URL;
  const params = config.RSS_PROXY_URL_PARAMS;
  const httpClient = axios.create({ baseURL, params });

  const get = (url) => httpClient.get('/get', { params: { url } })
    .then(({ data }) => data.contents)
    .catch((err) => {
      throw new AppError(err, 'loading');
    });

  return { get };
};

export default createHTTPClient;
