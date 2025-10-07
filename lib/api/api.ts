import axios, { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

API.interceptors.request.use(function (config: AxiosRequestConfig) {
  if (!config) {
    config = {};
  }
  if (!config.headers) {
    config.headers = {};
  }
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  if (sessionStorage.getItem('token')) {
    config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
  }
  return config;
});

API.interceptors.response.use(
  async response => {
    if (!response.data.result) {
      throw response.data;
    } else {
      if (response.headers['x-auth-token']) {
        sessionStorage.setItem('token', response.headers['x-auth-token']);
      }
    }
    return response.data;
  },
  error => {

    if (error.response?.status === 401) {
      Swal.fire({
        title: '請重新登入',
        text: '登入逾時，請重新登入',
        icon: 'error',
        confirmButtonText: '確定'
      }).then(() => {
        sessionStorage.clear();
        window.location.href = '/login';
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default API;