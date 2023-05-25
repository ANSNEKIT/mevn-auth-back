import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import userRouter from './routers/user';
import { errorHandler } from './middlewares/common/errorsHandler';
import { notFound } from './middlewares/common/errorNotFound';
import { HTTPError } from './types/HttpErrors';

mongoose
	.connect('mongodb+srv://bdmernauth:TfB6k0mXUqWXGlVN@cluster0.2an7hii.mongodb.net/')
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err));

dotenv.config();

const app = express();
const corsOptions = {
	origin: '*',
	credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/ping', (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.status(200).send({ status: 'OK' });
	} catch (error) {
		console.log(error);
		return next(new HTTPError(500, 'Ошибка при запросе пинга'));
	}
});
app.use('/', userRouter);
app.use(errorHandler);
app.use(notFound);

const port = Number(process.env.PORT) || 4444;
app.listen(port, () => console.log(`Сервер запущен. Прослушиваю порт ${port}`));
