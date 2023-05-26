export interface DocumentResult<T> {
	_doc: T;
}

export interface IUserBD extends DocumentResult<IUserBD> {
	_id: any;
	passwordHash: string;
	email: string;
	name: string;
	tokens: IToken[];
	createdAt: Date;
}

export interface IUser {
	id: number;
	email: string;
	name: string;
	createdAt: Date;
}

export interface IToken {
	token: string;
	signedAt: string;
}

export interface IEventModel extends IUserBD, Document {}

export interface TokenInterface {
	_id: string;
}
