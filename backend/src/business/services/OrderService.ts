import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';
import { CartRepository } from '../../infrastructure/repositories/CartRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ValidationError } from '../exceptions/ValidationError';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { generateOrderReference } from '../../shared/utils/orderRef';
import { buildPaginatedResult, getPaginationParams } from '../../shared/utils/pagination';
import { prisma } from '../../config/database';
import { OrderStatus } from '@prisma/client';

const orderRepo = new OrderRepository();
const bookRepo = new BookRepository();
const cartRepo = new CartRepository();

export class OrderService {
  async getUserOrders(userId: number, params: { page?: number; limit?: number }) {
    const { page, limit, skip } = getPaginationParams(params);
    const { orders, total } = await orderRepo.findByUser(userId, { skip, take: limit });
    return buildPaginatedResult(orders, total, page, limit);
  }

  async getAllOrders(params: { page?: number; limit?: number; status?: OrderStatus }) {
    const { page, limit, skip } = getPaginationParams(params);
    const { orders, total } = await orderRepo.findAll({ skip, take: limit, status: params.status });
    return buildPaginatedResult(orders, total, page, limit);
  }

  async getOrderById(id: number, userId: number, isAdmin: boolean) {
    const order = await orderRepo.findById(id);
    if (!order) throw new NotFoundError('Order');
    if (!isAdmin && order.userId !== userId) throw new ForbiddenError();
    return order;
  }

  async createOrderFromCart(userId: number, notes?: string) {
    const cartItems = await cartRepo.findByUser(userId);
    if (cartItems.length === 0) throw new ValidationError('Cart is empty');

    // Validate stock
    for (const item of cartItems) {
      if (item.book.stock < item.quantity) {
        throw new ValidationError(`Insufficient stock for "${item.book.title}"`);
      }
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.book.price) * item.quantity,
      0
    );

    const reference = generateOrderReference();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          reference,
          totalAmount,
          notes,
          userId,
          items: {
            create: cartItems.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
              unitPrice: item.book.price,
            })),
          },
        },
        include: {
          items: { include: { book: { select: { id: true, title: true } } } },
        },
      });

      // Decrement stock
      for (const item of cartItems) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    return order;
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const order = await orderRepo.findById(id);
    if (!order) throw new NotFoundError('Order');
    return orderRepo.updateStatus(id, status);
  }
}
