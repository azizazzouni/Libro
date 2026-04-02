import { apiClient } from './client';
import { Book, PaginatedResponse } from '../types';

export interface BookFilters {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
}

export const booksApi = {
  getAll: (filters: BookFilters = {}) =>
    apiClient.get<PaginatedResponse<Book>>('/books', { params: filters }),

  getBySlug: (slug: string) =>
    apiClient.get<{ success: boolean; data: Book }>(`/books/slug/${slug}`),

  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: Book }>(`/books/${id}`),

  create: (data: FormData | object) =>
    apiClient.post<{ success: boolean; data: Book }>('/books', data),

  update: (id: number, data: object) =>
    apiClient.patch<{ success: boolean; data: Book }>(`/books/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/books/${id}`),

  getReviews: (bookId: number, params: { page?: number; limit?: number } = {}) =>
    apiClient.get(`/books/${bookId}/reviews`, { params }),

  addReview: (bookId: number, body: { rating: number; comment?: string }) =>
    apiClient.post(`/books/${bookId}/reviews`, body),
};
