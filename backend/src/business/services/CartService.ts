import { CartRepository } from '../../infrastructure/repositories/CartRepository';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ValidationError } from '../exceptions/ValidationError';

const cartRepo = new CartRepository();
const bookRepo = new BookRepository();

export class CartService {
  async getCart(userId: number) {
    const items = await cartRepo.findByUser(userId);
    const total = items.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0);
    return { items, total };
  }

  async addToCart(userId: number, bookId: number, quantity: number) {
    if (quantity < 1) throw new ValidationError('Quantity must be at least 1');
    const book = await bookRepo.findById(bookId);
    if (!book) throw new NotFoundError('Book');
    if (book.stock < quantity) throw new ValidationError('Insufficient stock');
    return cartRepo.upsert(userId, bookId, quantity);
  }

  async removeFromCart(userId: number, bookId: number) {
    const item = await cartRepo.findItem(userId, bookId);
    if (!item) throw new NotFoundError('Cart item');
    return cartRepo.remove(userId, bookId);
  }

  async clearCart(userId: number) {
    return cartRepo.clear(userId);
  }
}
