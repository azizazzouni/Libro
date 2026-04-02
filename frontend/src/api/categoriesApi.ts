import { apiClient } from './client';
import { Category } from '../types';

export const categoriesApi = {
  getAll: () =>
    apiClient.get<{ success: boolean; data: Category[] }>('/categories'),

  create: (data: { name: string; description?: string; parentId?: number }) =>
    apiClient.post('/categories', data),

  update: (id: number, data: object) =>
    apiClient.patch(`/categories/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/categories/${id}`),
};
