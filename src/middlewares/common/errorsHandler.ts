import { Request, Response } from 'express';
import { HTTPError } from '../../types/HttpErrors';

export const errorHandler = (err: Error | HTTPError, req: Request, res: Response): void => {
	console.error('error', err);

	if (err instanceof HTTPError) {
		const { message = 'Ошибка', statusCode = 500 } = err;
		res.status(statusCode).send({ err: message });
	} else {
		res.status(500).send({ err: 'Ошибка сервера' });
	}
};
