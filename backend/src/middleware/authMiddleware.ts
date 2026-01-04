import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/index";
import type { AuthRequest } from "../types/index";

export const requireAuth = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	// token from httpOnly cookie
	const token = req.cookies.token;

	if (!token) {
		res.status(401).json({ error: "Access token required!" });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
		req.userId = decoded.userId;
		next();
	} catch (err) {
		res.status(403).json({ error: "Invalid or expired token!" });
	}
};
