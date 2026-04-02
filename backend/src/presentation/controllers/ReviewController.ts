import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../../business/services/ReviewService';

const reviewService = new ReviewService();

export class ReviewController {
  async getBookReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await reviewService.getBookReviews(Number(req.params.bookId), { page: Number(page), limit: Number(limit) });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.createReview(req.user!.userId, Number(req.params.bookId), req.body.rating, req.body.comment);
      res.status(201).json({ success: true, data: review });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.updateReview(Number(req.params.id), req.user!.userId, req.body);
      res.json({ success: true, data: review });
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await reviewService.deleteReview(Number(req.params.id), req.user!.userId, req.user!.role === 'ADMIN');
      res.json({ success: true, message: 'Review deleted' });
    } catch (err) { next(err); }
  }
}
