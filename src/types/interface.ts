export interface DocumentResult<T> {
	_doc: T;
}

export interface IUser extends DocumentResult<IUser> {
	_id: any;
	passwordHash: string;
	email: string;
	name: string;
}

export interface IEventModel extends IUser, Document {}

export interface TokenInterface {
	_id: string;
}
