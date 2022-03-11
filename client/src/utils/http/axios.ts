import axios, { AxiosInstance } from 'axios';
import { requestSuccess, requestFail, responseSuccess, responseFail } from './interceptors';
import { config } from '../../config';

const fetch: AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: config.apiPrefix,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});
fetch.interceptors.request.use(requestSuccess, requestFail);
fetch.interceptors.response.use(responseSuccess, responseFail);
