import { ResponseType } from '@src/common/api/types';
import axios, { AxiosRequestConfig } from 'axios';

const yaymailRest = window.yaymailData.rest_path;

const _axios = axios.create({
  baseURL: `${yaymailRest.root}${yaymailRest.base}`,
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': yaymailRest.nonce,
  },
  withCredentials: true,
});

const restApi = {
  get: <T extends ResponseType = ResponseType>(url: string, config?: AxiosRequestConfig) => {
    return _axios.get<T>(url, config);
  },
  post: <T extends ResponseType = ResponseType>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => {
    return _axios.post<T>(url, data, config);
  },
  patch: <T extends ResponseType = ResponseType>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => {
    return _axios.patch<T>(url, data, config);
  },
  delete: <T extends ResponseType = ResponseType>(url: string, config?: AxiosRequestConfig) => {
    return _axios.delete<T>(url, config);
  },
};

export default restApi;
