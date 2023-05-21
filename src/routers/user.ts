import { Router } from 'express';
import { UserController } from '../users';
import checkAuth from '../middlewares/auth/checkAuth';
import { validateLogin } from '../middlewares/auth/validateLogin.middleware';
import { validateRegistration } from '../middlewares/auth/validateRegistration.middleware';

const { register, login, info } = UserController;

const router = Router();
router.post('/signup', validateRegistration, register);
router.post('/signin', validateLogin, login);
router.get('/info', checkAuth, info);
// router.get('/logout', checkAuth, logout);

export default router;
