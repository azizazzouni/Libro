import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/authMiddleware';
import { validate, registerSchema, loginSchema } from '../middleware/validate';
import { authLimiter } from '../../infrastructure/security/rateLimiters';

const router = Router();
const ctrl = new AuthController();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

router.post('/register', validate(registerSchema), ctrl.register.bind(ctrl));
router.post('/login', validate(loginSchema), ctrl.login.bind(ctrl));
router.post('/refresh', ctrl.refresh.bind(ctrl));
router.post('/logout', authenticate, ctrl.logout.bind(ctrl));
router.get('/me', authenticate, ctrl.me.bind(ctrl));

export default router;
