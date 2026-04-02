import axios, { AxiosInstance } from 'axios';
import { store } from '../store';
import { logoutThunk } from '../store/slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true, // Send httpOnly cookies automatically on every request
});

// ─── Auto-refresh on 401 ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(undefined);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Only intercept 401 — skip the refresh endpoint itself to avoid loops
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Queue subsequent requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // The refresh token is in an httpOnly cookie — no token needed in body
        await apiClient.post('/auth/refresh');
        processQueue(null);
        return apiClient(original);
      } catch (refreshError) {
        processQueue(refreshError);
        store.dispatch(logoutThunk());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
