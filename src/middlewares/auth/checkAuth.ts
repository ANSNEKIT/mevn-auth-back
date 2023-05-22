import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { TokenInterface } from '../../types/interface';
import { HTTPError } from '../../types/HttpErrors';

export const checkAuth = (req: Request, res: Response, next: NextFunction): void | NextFunction => {
	const token = (req.headers?.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		try {
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || 'secret123',
			) as TokenInterface;

			req.userId = decoded._id;
			return next();
		} catch (err: unknown) {
			console.log(err);
			return next(new HTTPError(403, 'Нет доступа'));
		}
	} else {
		return next(new HTTPError(403, 'Нет доступа'));
	}
};
