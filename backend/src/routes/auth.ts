import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router: ExpressRouter = Router();

// POST /register
router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({ error: "All fields are required!" });
			return;
		}

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

		res.status(201).json({
			message: "User registered successfully !",
			user: newUser,
			token,
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ error: "Internal server error !" });
	}
});

// POST /login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ error: "Email and password are required !" });
			return;
		}

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

		res.json({
			message: "Login successful !",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error !" });
	}
});

// POST Logout (client-side token removal, server just acknowledges)
router.post("/logout", async (req, res) => {
	res.json({ message: "Logout successful !" });
});

export default router;
