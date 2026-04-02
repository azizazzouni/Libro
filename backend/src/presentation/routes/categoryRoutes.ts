import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const ctrl = new CategoryController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', authenticate, requireAdmin, ctrl.create.bind(ctrl));
router.patch('/:id', authenticate, requireAdmin, ctrl.update.bind(ctrl));
router.delete('/:id', authenticate, requireAdmin, ctrl.delete.bind(ctrl));

export default router;
