import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const ctrl = new CartController();

router.use(authenticate);
router.get('/', ctrl.getCart.bind(ctrl));
router.post('/', ctrl.addItem.bind(ctrl));
router.delete('/clear', ctrl.clearCart.bind(ctrl));
router.delete('/:bookId', ctrl.removeItem.bind(ctrl));

export default router;
