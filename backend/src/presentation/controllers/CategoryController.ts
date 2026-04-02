import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../../business/services/CategoryService';

const categoryService = new CategoryService();

export class CategoryController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getCategories();
      res.json({ success: true, data: categories });
    } catch (err) { next(err); }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await categoryService.getCategoryById(Number(req.params.id));
      res.json({ success: true, data: cat });
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await categoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: cat });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await categoryService.updateCategory(Number(req.params.id), req.body);
      res.json({ success: true, data: cat });
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.deleteCategory(Number(req.params.id));
      res.json({ success: true, message: 'Category deleted' });
    } catch (err) { next(err); }
  }
}
