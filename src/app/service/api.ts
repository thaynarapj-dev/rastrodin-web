import axios from 'axios';
import { serviceConfig } from './config';

export const api = axios.create({
  baseURL: serviceConfig.baseUrl,
  headers: serviceConfig.defaultHeaders,
});

export function setApiAuthToken(accessToken: string | null) {
  api.defaults.headers.common.Authorization = accessToken
    ? `Bearer ${accessToken}`
    : serviceConfig.defaultHeaders.Authorization;
}

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
