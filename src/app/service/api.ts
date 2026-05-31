import axios from 'axios';
import { serviceConfig } from './config';

export const api = axios.create({
  baseURL: serviceConfig.baseUrl,
  headers: serviceConfig.defaultHeaders,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Erro ao comunicar com a API.';

    return Promise.reject(new Error(message));
  },
);
