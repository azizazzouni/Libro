import { apiClient } from './client';
import { User } from '../types';

interface AuthResponse {
  user: User;
  // Tokens are no longer returned in the response body — they are set as httpOnly cookies
}

export const authApi = {
  register: (body: { email: string; name: string; password: string }) =>
    apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', body),

  login: (body: { email: string; password: string }) =>
    apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', body),

  logout: () =>
    apiClient.post<{ success: boolean; message: string }>('/auth/logout'),

  me: () =>
    apiClient.get<{ success: boolean; data: User }>('/auth/me'),
};
