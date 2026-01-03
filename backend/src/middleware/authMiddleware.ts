import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/index.js";
import type { AuthRequest } from "../types/index.js";

export const requireAuth = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.get("authorization");

	const token = authHeader && authHeader.split(" ")[1];

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
