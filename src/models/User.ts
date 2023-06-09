import mongoose from 'mongoose';
import { IUserBD } from '../types/interface';

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		tokens: {
			type: Array,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IUserBD>('User', UserSchema);
