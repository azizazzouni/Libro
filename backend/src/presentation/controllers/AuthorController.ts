import { Request, Response, NextFunction } from 'express';
import { AuthorService } from '../../business/services/AuthorService';

const authorService = new AuthorService();

export class AuthorController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.query;
      const result = await authorService.getAuthors({ page: Number(page), limit: Number(limit), search: search as string });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const author = await authorService.getAuthorById(Number(req.params.id));
      res.json({ success: true, data: author });
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const author = await authorService.createAuthor(req.body);
      res.status(201).json({ success: true, data: author });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const author = await authorService.updateAuthor(Number(req.params.id), req.body);
      res.json({ success: true, data: author });
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await authorService.deleteAuthor(Number(req.params.id));
      res.json({ success: true, message: 'Author deleted' });
    } catch (err) { next(err); }
  }
}
