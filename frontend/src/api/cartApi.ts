import { apiClient } from './client';
import { CartItem } from '../types';

export const cartApi = {
  getCart: () =>
    apiClient.get<{ success: boolean; data: { items: CartItem[]; total: number } }>('/cart'),

  addItem: (bookId: number, quantity = 1) =>
    apiClient.post('/cart', { bookId, quantity }),

  removeItem: (bookId: number) =>
    apiClient.delete(`/cart/${bookId}`),

  clearCart: () =>
    apiClient.delete('/cart/clear'),
};
