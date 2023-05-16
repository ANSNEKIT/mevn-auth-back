import { Router } from 'express';
import { UserController } from '../users';
import checkAuth from '../utils/checkAuth';

const { register, login, info } = UserController;

const router = Router();
router.post('/signup', register);
router.post('/signin', login);
router.get('/info', checkAuth, info);
router.get('/logout', checkAuth, logout);

module.exports = {
	router,
};
