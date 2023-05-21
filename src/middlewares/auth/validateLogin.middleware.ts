import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { UserLoginDto } from '../../users/dto/UserLogin.dto';

export const validateLogin = ({ body }: Request, res: Response, next: NextFunction): void => {
	const instanseLogin = new UserLoginDto();
	instanseLogin.email = body.email;
	instanseLogin.password = body.password;
	validate(instanseLogin).then((errors) => {
		if (errors.length > 0) {
			res.status(422).send(errors);
		} else {
			next();
		}
	});
};
