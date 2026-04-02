import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const bookCtrl = new BookController();
const reviewCtrl = new ReviewController();

router.get('/', bookCtrl.getAll.bind(bookCtrl));
router.get('/:id(\\d+)', bookCtrl.getOne.bind(bookCtrl));
router.get('/slug/:slug', bookCtrl.getBySlug.bind(bookCtrl));
router.post('/', authenticate, requireAdmin, bookCtrl.create.bind(bookCtrl));
router.patch('/:id', authenticate, requireAdmin, bookCtrl.update.bind(bookCtrl));
router.delete('/:id', authenticate, requireAdmin, bookCtrl.delete.bind(bookCtrl));

// Reviews nested under books
router.get('/:bookId/reviews', reviewCtrl.getBookReviews.bind(reviewCtrl));
router.post('/:bookId/reviews', authenticate, reviewCtrl.create.bind(reviewCtrl));

export default router;
