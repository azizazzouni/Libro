import { AuthorRepository } from '../../infrastructure/repositories/AuthorRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ConflictError } from '../exceptions/ConflictError';
import { generateSlug } from '../../shared/utils/slug';
import { buildPaginatedResult, getPaginationParams } from '../../shared/utils/pagination';
import { prisma } from '../../config/database';
const authorRepo = new AuthorRepository();

export class AuthorService {
  async getAuthors(params: { page?: number; limit?: number; search?: string }) {
    const { page, limit, skip } = getPaginationParams(params);
    const { authors, total } = await authorRepo.findAll({
      skip,
      take: limit,
      search: params.search,
    });
    return buildPaginatedResult(authors, total, page, limit);
  }

  async getAuthorById(id: number) {
    const author = await authorRepo.findById(id);
    if (!author) throw new NotFoundError('Author');
    return author;
  }

  async createAuthor(data: { name: string; bio?: string; photoUrl?: string }) {
    const slug = generateSlug(data.name);
    const existing = await authorRepo.findBySlug(slug);
    if (existing) throw new ConflictError('Author already exists');
    return authorRepo.create({ ...data, slug });
  }

  async updateAuthor(id: number, data: Partial<{ name: string; bio: string; photoUrl: string }>) {
    const author = await authorRepo.findById(id);
    if (!author) throw new NotFoundError('Author');
    const updateData: Record<string, unknown> = { ...data };
    if (data.name) updateData['slug'] = generateSlug(data.name);
    return authorRepo.update(id, updateData);
  }

  async deleteAuthor(id: number) {
    const author = await authorRepo.findById(id);
    if (!author) throw new NotFoundError('Author');

    // Supprimer d'abord toutes les relations liées aux livres de cet auteur
    await prisma.bookCategory.deleteMany({ where: { book: { authorId: id } } });
    await prisma.cartItem.deleteMany({ where: { book: { authorId: id } } });
    await prisma.wishlist.deleteMany({ where: { book: { authorId: id } } });
    await prisma.orderItem.deleteMany({ where: { book: { authorId: id } } });
    await prisma.review.deleteMany({ where: { book: { authorId: id } } });

    // Supprimer les livres
    await prisma.book.deleteMany({ where: { authorId: id } });

    // Supprimer l'auteur
    return authorRepo.delete(id);
  }
}
