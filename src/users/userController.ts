import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import UserModel from '../models/User';
import { HTTPError } from '../types/HttpErrors';
import { UserRegisterDto } from './dto/UserRegister.dto';

const register = async (
	{ body }: Request<Record<string, unknown>, Record<string, unknown>, UserRegisterDto>,
	res: Response,
	next: NextFunction,
): Promise<void | NextFunction> => {
	try {
		const password = body.password;
		const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: body.email,
			name: body.name,
			passwordHash: hash,
		});

		const user = await doc.save();

		if (!user) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			process.env.SECRET || 'secret123',
			{
				expiresIn: '2h',
			},
		);

		res.json({
			token,
		});
	} catch (err) {
		console.log(err);
		return next(new HTTPError(500, 'Не удалось зарегистрироваться'));
	}
};

const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | NextFunction> => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return next(new HTTPError(422, 'Пользователь не найден'));
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if (!isValidPass) {
			return next(new HTTPError(400, 'Неверный логин или пароль'));
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			process.env.SECRET || 'secret123',
			{
				expiresIn: '2h',
			},
		);

		res.json({ token });
	} catch (err) {
		console.log(err);
		return next(new HTTPError(500, 'Не удалось авторизоваться'));
	}
};

const info = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | NextFunction> => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return next(new HTTPError(404, 'Пользователь не найден'));
		}

		const { email, name } = user._doc;

		res.json({ login: email, name });
	} catch (err) {
		console.log(err);
		return next(new HTTPError(500, 'Нет доступа'));
	}
};

export { register, login, info };
