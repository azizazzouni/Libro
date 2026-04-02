import { prisma } from '../../config/database';

export class CartRepository {
  async findByUser(userId: number) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: { book: { select: { id: true, title: true, price: true, coverUrl: true, stock: true } } },
    });
  }

  async findItem(userId: number, bookId: number) {
    return prisma.cartItem.findUnique({ where: { userId_bookId: { userId, bookId } } });
  }

  async upsert(userId: number, bookId: number, quantity: number) {
    return prisma.cartItem.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { quantity },
      create: { userId, bookId, quantity },
      include: { book: { select: { id: true, title: true, price: true, coverUrl: true } } },
    });
  }

  async remove(userId: number, bookId: number) {
    return prisma.cartItem.delete({ where: { userId_bookId: { userId, bookId } } });
  }

  async clear(userId: number) {
    return prisma.cartItem.deleteMany({ where: { userId } });
  }
}
