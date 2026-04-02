import { Request, Response, NextFunction } from 'express';
import { CartService } from '../../business/services/CartService';

const cartService = new CartService();

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      res.json({ success: true, data: cart });
    } catch (err) { next(err); }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, quantity } = req.body;
      const item = await cartService.addToCart(req.user!.userId, bookId, quantity ?? 1);
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      await cartService.removeFromCart(req.user!.userId, Number(req.params.bookId));
      res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) { next(err); }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      await cartService.clearCart(req.user!.userId);
      res.json({ success: true, message: 'Cart cleared' });
    } catch (err) { next(err); }
  }
}
