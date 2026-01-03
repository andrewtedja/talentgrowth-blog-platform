export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	createdAt: Date;
}
export interface AuthRequest extends Request {
	userId?: number;
}

export interface JWTPayload {
	userId: number;
}
