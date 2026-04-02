import { Router } from 'express';
import authRoutes from './authRoutes';
import bookRoutes from './bookRoutes';
import authorRoutes from './authorRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes';
import cartRoutes from './cartRoutes';
import reviewRoutes from './reviewRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/reviews', reviewRoutes);

export default router;
