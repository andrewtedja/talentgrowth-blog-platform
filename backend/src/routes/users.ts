import { Router, type Router as ExpressRouter } from "express";
import { db } from "../db/index";
import { users, posts } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/authMiddleware";
import type { AuthRequest } from "../types/index";

const router: ExpressRouter = Router();

// GET /api/users/:id
router.get("/:id", async (req, res) => {
	try {
		const userId = Number(req.params.id);

		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				createdAt: users.createdAt,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		const userPosts = await db
			.select({
				id: posts.id,
				title: posts.title,
				createdAt: posts.createdAt,
			})
			.from(posts)
			.where(eq(posts.authorId, userId));

		res.json({
			...user,
			postsCount: userPosts.length,
			posts: userPosts,
		});
	} catch (error) {
		console.error("Get user profile error:", error);
		res.status(500).json({ error: "Failed to fetch user profile" });
	}
});

// GET /api/users/me/profile
router.get("/me/profile", requireAuth, async (req: AuthRequest, res) => {
	try {
		const userId = req.userId!;

		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				createdAt: users.createdAt,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		const userPosts = await db
			.select({
				id: posts.id,
				title: posts.title,
				createdAt: posts.createdAt,
			})
			.from(posts)
			.where(eq(posts.authorId, userId));

		res.json({
			...user,
			postsCount: userPosts.length,
			posts: userPosts,
		});
	} catch (error) {
		console.error("Get current user profile error:", error);
		res.status(500).json({ error: "Failed to fetch profile" });
	}
});

export default router;
