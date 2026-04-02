import { BookRepository, BookFilters } from '../../infrastructure/repositories/BookRepository';
import { AuthorRepository } from '../../infrastructure/repositories/AuthorRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ConflictError } from '../exceptions/ConflictError';
import { generateSlug } from '../../shared/utils/slug';
import { buildPaginatedResult, getPaginationParams } from '../../shared/utils/pagination';

const bookRepo = new BookRepository();
const authorRepo = new AuthorRepository();

export class BookService {
  async getBooks(filters: BookFilters & { page?: number; limit?: number }) {
    const { page, limit, skip } = getPaginationParams(filters);
    const { books, total } = await bookRepo.findAll({ ...filters, skip, take: limit });
    return buildPaginatedResult(books, total, page, limit);
  }

  async getBookById(id: number) {
    const book = await bookRepo.findById(id);
    if (!book) throw new NotFoundError('Book');
    return book;
  }

  async getBookBySlug(slug: string) {
    const book = await bookRepo.findBySlug(slug);
    if (!book) throw new NotFoundError('Book');
    return book;
  }

  async createBook(data: {
    title: string;
    description?: string;
    isbn?: string;
    price: number;
    stock?: number;
    coverUrl?: string;
    publishedAt?: Date;
    language?: string;
    pages?: number;
    authorId: number;
    categoryIds?: number[];
  }) {
    const author = await authorRepo.findById(data.authorId);
    if (!author) throw new NotFoundError('Author');

    const slug = generateSlug(data.title);
    const existing = await bookRepo.findBySlug(slug);
    if (existing) throw new ConflictError('A book with this title already exists');

    const { categoryIds = [], authorId, ...rest } = data;

    return bookRepo.create({
      ...rest,
      slug,
      author: { connect: { id: authorId } },
      categories: {
        create: categoryIds.map((id) => ({ category: { connect: { id } } })),
      },
    });
  }

  async updateBook(
    id: number,
    data: Partial<{
      title: string;
      price: number;
      stock: number;
      description: string;
      coverUrl: string;
      isActive: boolean;
      authorId: number;
      isbn: string;
      pages: number;
      language: string;
      categoryIds: number[];
    }>
  ) {
    const book = await bookRepo.findById(id);
    if (!book) throw new NotFoundError('Book');

    const { categoryIds, authorId, title, ...rest } = data;

    const updateData: Record<string, unknown> = { ...rest };

    if (title) {
      updateData['title'] = title;
      updateData['slug'] = generateSlug(title);
    }

    if (authorId) {
      updateData['author'] = { connect: { id: authorId } };
    }

    if (categoryIds !== undefined) {
      updateData['categories'] = {
        deleteMany: {},
        create: categoryIds.map((cId) => ({ category: { connect: { id: cId } } })),
      };
    }

    return bookRepo.update(id, updateData);
  }

  async deleteBook(id: number) {
    const book = await bookRepo.findById(id);
    if (!book) throw new NotFoundError('Book');
    return bookRepo.delete(id);
  }
}
