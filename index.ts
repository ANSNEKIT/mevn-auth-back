import express from 'express';
import fs from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();
app.use(express.json());
app.use(cors());
app.use('/users', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);