import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export class ReviewRepository {
  async findById(id: number) {
    return prisma.review.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } }, book: { select: { id: true, title: true } } },
    });
  }

  async findByBook(bookId: number, params: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = params;
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { bookId },
        skip, take,
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { bookId } }),
    ]);
    return { reviews, total };
  }

  async findByUserAndBook(userId: number, bookId: number) {
    return prisma.review.findUnique({ where: { userId_bookId: { userId, bookId } } });
  }

  async getAverageRating(bookId: number): Promise<number> {
    const result = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
    });
    return result._avg.rating ?? 0;
  }

  async create(data: Prisma.ReviewCreateInput) {
    return prisma.review.create({
      data,
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async update(id: number, data: Prisma.ReviewUpdateInput) {
    return prisma.review.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.review.delete({ where: { id } });
  }
}
