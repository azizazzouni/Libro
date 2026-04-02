import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export class AuthorRepository {
  async findById(id: number) {
    return prisma.author.findUnique({ where: { id }, include: { books: { where: { isActive: true }, take: 10 } } });
  }

  async findBySlug(slug: string) {
    return prisma.author.findUnique({ where: { slug } });
  }

  async findAll(params: { skip?: number; take?: number; search?: string }) {
    const { skip = 0, take = 10, search } = params;
    const where: Prisma.AuthorWhereInput = {};
    if (search) where.name = { contains: search };
    const [authors, total] = await Promise.all([
      prisma.author.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      prisma.author.count({ where }),
    ]);
    return { authors, total };
  }

  async create(data: Prisma.AuthorCreateInput) {
    return prisma.author.create({ data });
  }

  async update(id: number, data: Prisma.AuthorUpdateInput) {
    return prisma.author.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.author.delete({ where: { id } });
  }
}
