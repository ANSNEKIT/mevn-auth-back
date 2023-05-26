import { NextFunction, Response, Request, Router } from 'express';
import { HTTPError } from '../types/HttpErrors';

const router = Router();

const ping = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.status(200).send({ status: 'OK' });
	} catch (error) {
		console.log(error);
		return next(new HTTPError(500, 'Ошибка при запросе пинга'));
	}
};

router.get('/', ping);

export default router;
