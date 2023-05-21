import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response): void => {
	res.status(404).send({ message: 'Неверный запрос' });
};
