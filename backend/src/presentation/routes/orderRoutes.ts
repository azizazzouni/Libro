import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const ctrl = new OrderController();

router.get('/my', authenticate, ctrl.getMyOrders.bind(ctrl));
router.get('/', authenticate, requireAdmin, ctrl.getAllOrders.bind(ctrl));
router.get('/:id', authenticate, ctrl.getOne.bind(ctrl));
router.post('/checkout', authenticate, ctrl.checkout.bind(ctrl));
router.patch('/:id/status', authenticate, requireAdmin, ctrl.updateStatus.bind(ctrl));

export default router;
