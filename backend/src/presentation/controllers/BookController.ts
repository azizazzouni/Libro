import { Request, Response, NextFunction } from 'express';
import { BookService } from '../../business/services/BookService';

const bookService = new BookService();

export class BookController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, authorId, categoryId, minPrice, maxPrice, language } = req.query;
      const result = await bookService.getBooks({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        authorId: authorId ? Number(authorId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        language: language as string,
      });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.getBookById(Number(req.params.id));
      res.json({ success: true, data: book });
    } catch (err) { next(err); }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.getBookBySlug(req.params.slug);
      res.json({ success: true, data: book });
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.updateBook(Number(req.params.id), req.body);
      res.json({ success: true, data: book });
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await bookService.deleteBook(Number(req.params.id));
      res.json({ success: true, message: 'Book deleted' });
    } catch (err) { next(err); }
  }
}
