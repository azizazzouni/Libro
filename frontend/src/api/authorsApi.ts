import { apiClient } from './client';
import { Author, PaginatedResponse } from '../types';

export const authorsApi = {
  getAll: (params: { page?: number; limit?: number; search?: string } = {}) =>
    apiClient.get<PaginatedResponse<Author>>('/authors', { params }),

  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: Author }>(`/authors/${id}`),

  create: (data: { name: string; bio?: string; photoUrl?: string }) =>
    apiClient.post('/authors', data),

  update: (id: number, data: object) =>
    apiClient.patch(`/authors/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/authors/${id}`),
};
