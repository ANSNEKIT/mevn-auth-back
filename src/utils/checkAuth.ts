import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../types/interface';

export default (
	req: UserRequest,
	res: Response,
	next: NextFunction,
): void | Response<any, Record<string, any>> => {
	const token = (req.headers?.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.SECRET || 'secret123');

			req.userId = decoded._id;
			next();
		} catch (e) {
			return res.status(403).json({
				message: 'Нет доступа',
			});
		}
	} else {
		return res.status(403).json({
			message: 'Нет доступа',
		});
	}
};
