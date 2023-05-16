import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

mongoose
	.connect('mongodb+srv://bdmernauth:TfB6k0mXUqWXGlVN@cluster0.2an7hii.mongodb.net/')
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err));

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
// app.use('/users');
const port = Number(process.env.PORT) || 4444;
app.listen(port, () => console.log(`Server started on port ${port}`));
