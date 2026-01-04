import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { loginSchema, registerSchema } from "../validations/auth-validation";

const router: ExpressRouter = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
	try {
		const result = registerSchema.safeParse(req.body);

		if (!result.success) {
			res.status(400).json({
				error: "Validation failed",
				details: result.error.issues,
			});
			return;
		}

		const { name, email, password } = result.data;

		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existingUser.length > 0) {
			res.status(400).json({ error: "User already exists!" });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const [newUser] = await db
			.insert(users)
			.values({
				name,
				email,
				password: hashedPassword,
			})
			.returning({ id: users.id, name: users.name, email: users.email });

		const token = jwt.sign({ userId: newUser!.id }, process.env.JWT_SECRET!, {
			expiresIn: "7d",
		});

		// httpOnly cookie config
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(201).json({
			message: "User registered successfully !",
			user: newUser,
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ error: "Internal server error !" });
	}
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
	try {
		const result = loginSchema.safeParse(req.body);

		if (!result.success) {
			res.status(400).json({
				error: "Validation failed",
				details: result.error.issues,
			});
			return;
		}

		const { email, password } = result.data;

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!user) {
			res.status(401).json({ error: "Invalid credentials !" });
			return;
		}

		if (!(await bcrypt.compare(password, user.password))) {
			res.status(401).json({ error: "Invalid credentials !" });
			return;
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
			expiresIn: "7d",
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({
			message: "Login successful !",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error !" });
	}
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
	res.clearCookie("token");
	res.json({ message: "Logout successful !" });
});

export default router;
