import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import UserModel from '../models/User';
import { HTTPError } from '../types/HttpErrors';
import { UserRegisterDto } from './dto/UserRegister.dto';
import { IUser } from '../types/interface';

const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | NextFunction> => {
	try {
		const usersBD = await UserModel.find({});
		const users: IUser[] = usersBD.map((user, index) => ({
			id: index,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
		}));
		res.status(200).json({ users });
	} catch (error) {
		console.log(error);
		return next(new HTTPError(500, 'Не удалось получить список пользователей'));
	}
};

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
			process.env.JWT_SECRET || 'secret123',
			{
				expiresIn: '2h',
			},
		);

		await res.json({
			success: true,
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
			process.env.JWT_SECRET || 'secret123',
			{
				expiresIn: '2h',
			},
		);

		let oldTokens = user.tokens || [];

		if (oldTokens.length) {
			oldTokens = oldTokens.filter((t) => {
				const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
				const TWO_HOURS_SECONDS = 7200;
				if (timeDiff < TWO_HOURS_SECONDS) {
					return t;
				}
			});
		}

		await UserModel.findByIdAndUpdate(user._id, {
			tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
		});

		res.json({ success: true, token });
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

		res.json({ success: true, login: email, name });
	} catch (err) {
		console.log(err);
		return next(new HTTPError(500, 'Нет доступа'));
	}
};

const logout = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | NextFunction> => {
	try {
		const token = (req.headers?.authorization || '').replace(/Bearer\s?/, '');
		const isAllTokens = req.query.all || false;
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return next(new HTTPError(404, 'Пользователь не найден'));
		}

		const userTokens = user.tokens;
		const newTokens = userTokens.filter((t) => t.token !== token);

		await UserModel.findByIdAndUpdate(user._id, { tokens: isAllTokens ? [] : newTokens });

		res.json({ success: true, message: 'Успешно разлогинен!' });
	} catch (err) {
		console.log(err);
		return next(new HTTPError(500, 'Ошибка при попытке разлогиниться'));
	}
};

export { register, login, info, logout, getUsers };
