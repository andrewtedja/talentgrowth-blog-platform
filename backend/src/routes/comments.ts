import { Router, type Router as ExpressRouter } from "express";
import { db } from "../db/index";
import { comments, users, posts } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/authMiddleware";
import type { AuthRequest } from "../types/index";

const router: ExpressRouter = Router();

// GET /api/posts/:postId/comments
router.get("/posts/:postId/comments", async (req, res) => {
	try {
		const postId = Number(req.params.postId);

		const allComments = await db
			.select({
				id: comments.id,
				content: comments.content,
				createdAt: comments.createdAt,
				updatedAt: comments.updatedAt,
				author: {
					id: users.id,
					name: users.name,
					email: users.email,
				},
			})
			.from(comments)
			.leftJoin(users, eq(comments.authorId, users.id))
			.where(eq(comments.postId, postId))
			.orderBy(desc(comments.createdAt));

		res.json(allComments);
	} catch (error) {
		console.error("Get comments error:", error);
		res.status(500).json({ error: "Failed to fetch comments" });
	}
});

// POST /api/posts/:postId/comments
router.post("/posts/:postId/comments", requireAuth, async (req: AuthRequest, res) => {
	try {
		const postId = Number(req.params.postId);
		const { content } = req.body;

		if (!content) {
			res.status(400).json({ error: "Content is required" });
			return;
		}

		const [post] = await db
			.select()
			.from(posts)
			.where(eq(posts.id, postId))
			.limit(1);

		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		const [newComment] = await db
			.insert(comments)
			.values({
				content,
				postId,
				authorId: req.userId!,
			})
			.returning();

		res.status(201).json(newComment);
	} catch (error) {
		console.error("Create comment error:", error);
		res.status(500).json({ error: "Failed to create comment" });
	}
});

// PUT /api/comments/:id
router.put("/comments/:id", requireAuth, async (req: AuthRequest, res) => {
	try {
		const commentId = Number(req.params.id);
		const { content } = req.body;

		if (!content) {
			res.status(400).json({ error: "Content is required" });
			return;
		}

		const [existingComment] = await db
			.select()
			.from(comments)
			.where(eq(comments.id, commentId))
			.limit(1);

		if (!existingComment) {
			res.status(404).json({ error: "Comment not found" });
			return;
		}

		if (existingComment.authorId !== req.userId) {
			res.status(403).json({ error: "Unauthorized to edit this comment" });
			return;
		}

		const [updatedComment] = await db
			.update(comments)
			.set({
				content,
				updatedAt: new Date(),
			})
			.where(eq(comments.id, commentId))
			.returning();

		res.json(updatedComment);
	} catch (error) {
		console.error("Update comment error:", error);
		res.status(500).json({ error: "Failed to update comment" });
	}
});

// DELETE /api/comments/:id
router.delete("/comments/:id", requireAuth, async (req: AuthRequest, res) => {
	try {
		const commentId = Number(req.params.id);

		const [existingComment] = await db
			.select()
			.from(comments)
			.where(eq(comments.id, commentId))
			.limit(1);

		if (!existingComment) {
			res.status(404).json({ error: "Comment not found" });
			return;
		}

		if (existingComment.authorId !== req.userId) {
			res.status(403).json({ error: "Unauthorized to delete this comment" });
			return;
		}

		await db.delete(comments).where(eq(comments.id, commentId));

		res.json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.error("Delete comment error:", error);
		res.status(500).json({ error: "Failed to delete comment" });
	}
});

export default router;
