import axios from 'axios';
import Endpoints from './endpoints';

export default function createAxiosInstance() {
  const instance = axios.create({
    baseURL: Endpoints.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  return instance;
}
