import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ConflictError } from '../exceptions/ConflictError';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { ValidationError } from '../exceptions/ValidationError';
import { buildPaginatedResult, getPaginationParams } from '../../shared/utils/pagination';

const reviewRepo = new ReviewRepository();
const bookRepo = new BookRepository();

export class ReviewService {
  async getBookReviews(bookId: number, params: { page?: number; limit?: number }) {
    const { page, limit, skip } = getPaginationParams(params);
    const { reviews, total } = await reviewRepo.findByBook(bookId, { skip, take: limit });
    const avgRating = await reviewRepo.getAverageRating(bookId);
    return { ...buildPaginatedResult(reviews, total, page, limit), avgRating };
  }

  async createReview(userId: number, bookId: number, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) throw new ValidationError('Rating must be between 1 and 5');
    const book = await bookRepo.findById(bookId);
    if (!book) throw new NotFoundError('Book');
    const existing = await reviewRepo.findByUserAndBook(userId, bookId);
    if (existing) throw new ConflictError('You already reviewed this book');
    return reviewRepo.create({
      rating,
      comment,
      user: { connect: { id: userId } },
      book: { connect: { id: bookId } },
    });
  }

  async updateReview(id: number, userId: number, data: { rating?: number; comment?: string }) {
    const review = await reviewRepo.findById(id);
    if (!review) throw new NotFoundError('Review');
    if (review.userId !== userId) throw new ForbiddenError();
    if (data.rating && (data.rating < 1 || data.rating > 5)) throw new ValidationError('Rating must be between 1 and 5');
    return reviewRepo.update(id, data);
  }

  async deleteReview(id: number, userId: number, isAdmin: boolean) {
    const review = await reviewRepo.findById(id);
    if (!review) throw new NotFoundError('Review');
    if (!isAdmin && review.userId !== userId) throw new ForbiddenError();
    return reviewRepo.delete(id);
  }
}
