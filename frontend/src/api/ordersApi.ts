import { apiClient } from './client';
import { Order, PaginatedResponse } from '../types';

export const ordersApi = {
  getMyOrders: (params: { page?: number; limit?: number } = {}) =>
    apiClient.get<PaginatedResponse<Order>>('/orders/my', { params }),

  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: Order }>(`/orders/${id}`),

  checkout: (notes?: string) =>
    apiClient.post<{ success: boolean; data: Order }>('/orders/checkout', { notes }),

  getAllOrders: (params: { page?: number; limit?: number; status?: string } = {}) =>
    apiClient.get<PaginatedResponse<Order>>('/orders', { params }),

  updateStatus: (id: number, status: string) =>
    apiClient.patch(`/orders/${id}/status`, { status }),
};
