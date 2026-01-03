import { Router, type Router as ExpressRouter } from "express";
import { db } from "../db/index";
import { posts, users } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/authMiddleware";
import type { AuthRequest } from "../types/index";

const router: ExpressRouter = Router();

// GET /api/posts
router.get("/", async (req, res) => {
	try {
		const allPosts = await db
			.select({
				id: posts.id,
				title: posts.title,
				content: posts.content,
				createdAt: posts.createdAt,
				updatedAt: posts.updatedAt,
				author: {
					id: users.id,
					name: users.name,
					email: users.email,
				},
			})
			.from(posts)
			.leftJoin(users, eq(posts.authorId, users.id))
			.orderBy(desc(posts.createdAt));

		res.json(allPosts);
	} catch (error) {
		console.error("Get posts error:", error);
		res.status(500).json({ error: "Failed to fetch posts" });
	}
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
	try {
		const postId = Number(req.params.id);

		const [post] = await db
			.select({
				id: posts.id,
				title: posts.title,
				content: posts.content,
				createdAt: posts.createdAt,
				updatedAt: posts.updatedAt,
				author: {
					id: users.id,
					name: users.name,
					email: users.email,
				},
			})
			.from(posts)
			.leftJoin(users, eq(posts.authorId, users.id))
			.where(eq(posts.id, postId))
			.limit(1);

		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		res.json(post);
	} catch (error) {
		console.error("Get post error:", error);
		res.status(500).json({ error: "Failed to fetch post" });
	}
});

// POST /api/posts (protected)
router.post("/", requireAuth, async (req: AuthRequest, res) => {
	try {
		const { title, content } = req.body;

		if (!title || !content) {
			res.status(400).json({ error: "Title and content are required" });
			return;
		}

		const [newPost] = await db
			.insert(posts)
			.values({
				title,
				content,
				authorId: req.userId!,
			})
			.returning();

		res.status(201).json(newPost);
	} catch (error) {
		console.error("Create post error:", error);
		res.status(500).json({ error: "Failed to create post" });
	}
});

// UPDATE /api/posts/:id (protected, author only)
router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
	try {
		const postId = Number(req.params.id);
		const { title, content } = req.body;

		if (!title || !content) {
			res.status(400).json({ error: "Title and content are required" });
			return;
		}

		const [existingPost] = await db
			.select()
			.from(posts)
			.where(eq(posts.id, postId))
			.limit(1);

		if (!existingPost) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		if (existingPost.authorId !== req.userId) {
			res.status(403).json({ error: "Unauthorized to edit this post" });
			return;
		}

		const [updatedPost] = await db
			.update(posts)
			.set({
				title,
				content,
				updatedAt: new Date(),
			})
			.where(eq(posts.id, postId))
			.returning();

		res.json(updatedPost);
	} catch (error) {
		console.error("Update post error:", error);
		res.status(500).json({ error: "Failed to update post" });
	}
});

// DELETE /api/posts/:id (protected, author only)
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
	try {
		const postId = Number(req.params.id);

		const [existingPost] = await db
			.select()
			.from(posts)
			.where(eq(posts.id, postId))
			.limit(1);

		if (!existingPost) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		if (existingPost.authorId !== req.userId) {
			res.status(403).json({ error: "Unauthorized to delete this post" });
			return;
		}

		await db.delete(posts).where(eq(posts.id, postId));

		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Delete post error:", error);
		res.status(500).json({ error: "Failed to delete post" });
	}
});

export default router;
