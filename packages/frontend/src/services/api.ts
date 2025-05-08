// api.ts is the central Axios instance, that the app can use as the
// gateway to communicate with the server

import axios from 'axios';
import auth from './auth';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
});

// On 401, the interceptor will first try /refresh, then retry original
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config.__isRetry) {
      try {
        await auth.refresh();               
        error.config.__isRetry = true;
        return API(error.config);
      } catch {
      }
    }
    return Promise.reject(error);
  }
);

export default API;
