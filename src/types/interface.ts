import { JwtPayload } from 'jsonwebtoken';

export interface AuthHeader extends Headers {
	authorization?: string;
}

export interface UserRequest extends Request {
	userId: string | JwtPayload;
	headers: AuthHeader;
}
