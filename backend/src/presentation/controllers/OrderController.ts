import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../../business/services/OrderService';
import { OrderStatus } from '@prisma/client';

const orderService = new OrderService();

export class OrderController {
  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await orderService.getUserOrders(req.user!.userId, { page: Number(page), limit: Number(limit) });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status } = req.query;
      const result = await orderService.getAllOrders({ page: Number(page), limit: Number(limit), status: status as OrderStatus });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      const order = await orderService.getOrderById(Number(req.params.id), req.user!.userId, isAdmin);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  }

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrderFromCart(req.user!.userId, req.body.notes);
      res.status(201).json({ success: true, data: order });
    } catch (err) { next(err); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  }
}
