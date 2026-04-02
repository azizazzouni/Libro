import { Prisma, OrderStatus } from '@prisma/client';
import { prisma } from '../../config/database';

const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: { include: { book: { select: { id: true, title: true, coverUrl: true } } } },
} satisfies Prisma.OrderInclude;

export class OrderRepository {
  async findById(id: number) {
    return prisma.order.findUnique({ where: { id }, include: orderInclude });
  }

  async findByReference(reference: string) {
    return prisma.order.findUnique({ where: { reference }, include: orderInclude });
  }

  async findByUser(userId: number, params: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = params;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where: { userId }, skip, take, include: orderInclude, orderBy: { createdAt: 'desc' } }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { orders, total };
  }

  async findAll(params: { skip?: number; take?: number; status?: OrderStatus }) {
    const { skip = 0, take = 10, status } = params;
    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, skip, take, include: orderInclude, orderBy: { createdAt: 'desc' } }),
      prisma.order.count({ where }),
    ]);
    return { orders, total };
  }

  async create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({ data, include: orderInclude });
  }

  async updateStatus(id: number, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
  }
}
