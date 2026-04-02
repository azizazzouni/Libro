import { Prisma, Role } from '@prisma/client';
import { prisma } from '../../config/database';

export class UserRepository {
  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll(params: { skip?: number; take?: number; role?: Role }) {
    const { skip = 0, take = 10, role } = params;
    const where: Prisma.UserWhereInput = { isActive: true };
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    return { users, total };
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return prisma.user.update({ where: { id }, data: { isActive: false } });
  }
}
