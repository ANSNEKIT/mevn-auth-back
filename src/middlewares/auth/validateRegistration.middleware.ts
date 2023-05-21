import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { UserRegisterDto } from '../../users/dto/UserRegister.dto';

export const validateRegistration = (
	{ body }: Request,
	res: Response,
	next: NextFunction,
): void => {
	const instanseRegister = new UserRegisterDto();
	instanseRegister.name = body.name;
	instanseRegister.email = body.email;
	instanseRegister.password = body.password;
	validate(instanseRegister).then((errors) => {
		if (errors.length > 0) {
			res.status(422).send(errors);
		} else {
			next();
		}
	});
};
