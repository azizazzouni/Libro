import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export class CategoryRepository {
  async findById(id: number) {
    return prisma.category.findUnique({ where: { id }, include: { children: true, parent: true } });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  }

  async findAll() {
    return prisma.category.findMany({ where: { parentId: null }, include: { children: true } });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  }

  async update(id: number, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  }
}
