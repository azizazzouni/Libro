import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const ctrl = new ReviewController();

router.patch('/:id', authenticate, ctrl.update.bind(ctrl));
router.delete('/:id', authenticate, ctrl.delete.bind(ctrl));

export default router;
