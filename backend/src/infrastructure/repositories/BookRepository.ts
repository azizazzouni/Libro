import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export interface BookFilters {
  search?: string;
  authorId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  skip?: number;
  take?: number;
}

const bookInclude = {
  author: { select: { id: true, name: true, slug: true } },
  categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
  reviews: { select: { rating: true } },
} satisfies Prisma.BookInclude;

export class BookRepository {
  async findById(id: number) {
    return prisma.book.findUnique({ where: { id }, include: bookInclude });
  }

  async findBySlug(slug: string) {
    return prisma.book.findUnique({ where: { slug }, include: bookInclude });
  }

  async findAll(filters: BookFilters) {
    const { search, authorId, categoryId, minPrice, maxPrice, language, skip = 0, take = 10 } = filters;

    const where: Prisma.BookWhereInput = { isActive: true };
    if (search) where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
    if (authorId) where.authorId = authorId;
    if (language) where.language = language;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (categoryId) {
      where.categories = { some: { categoryId } };
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({ where, skip, take, include: bookInclude, orderBy: { createdAt: 'desc' } }),
      prisma.book.count({ where }),
    ]);
    return { books, total };
  }

  async create(data: Prisma.BookCreateInput) {
    return prisma.book.create({ data, include: bookInclude });
  }

  async update(id: number, data: Prisma.BookUpdateInput) {
    return prisma.book.update({ where: { id }, data, include: bookInclude });
  }

  async delete(id: number) {
    return prisma.book.update({ where: { id }, data: { isActive: false } });
  }

  async updateStock(id: number, delta: number) {
    return prisma.book.update({
      where: { id },
      data: { stock: { increment: delta } },
    });
  }
}
