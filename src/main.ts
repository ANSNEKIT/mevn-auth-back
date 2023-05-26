import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import userRouter from './routers/user';
import commonRouter from './routers/common';
import { errorHandler } from './middlewares/common/errorsHandler';
import { notFound } from './middlewares/common/errorNotFound';

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
app.use('/ping', commonRouter);
app.use('/', userRouter);
app.use(errorHandler);
app.use(notFound);

const port = Number(process.env.PORT) || 4444;
app.listen(port, () => console.log(`Сервер запущен. Прослушиваю порт ${port}`));
