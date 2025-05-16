// api.ts is the central Axios instance, that the app can use as the
// gateway to communicate with the server
import axios from 'axios';
import auth from './auth';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
});

// Check refresh cookie
const hasRefreshCookie = () =>
  typeof document !== 'undefined' &&
  document.cookie.split('; ').some((c) => c.startsWith('refresh='));

API.interceptors.response.use(
  res => res,
  async error => {
    const cfg = error.config;

    // Try once
    if (cfg?.url?.includes('/refresh') || cfg?.__isRetry) {
      return Promise.reject(error);
    }

    // only try if 401 and browser still holds a refresh cookie
    if (error.response?.status === 401 && hasRefreshCookie()) {
      try {
        await auth.refresh();         
        cfg.__isRetry = true;          
        return API(cfg);               
      } catch {
        /* refresh failed */
      }
    }

    return Promise.reject(error);
  }
);

export default API;
