import { Router, type Router as ExpressRouter } from "express";
import { db } from "../db/index";
import { posts, users } from "../db/schema";
import { eq, ilike, or, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/authMiddleware";
import type { AuthRequest } from "../types/index";
import {
	createPostSchema,
	updatePostSchema,
} from "../validations/posts-validation";

const router: ExpressRouter = Router();

// GET /api/posts
router.get("/", async (req, res) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const search = req.query.search as string | undefined;
		const offset = (page - 1) * limit;

		const whereCondition = search
			? or(
					ilike(posts.title, `%${search}%`),
					ilike(posts.content, `%${search}%`)
			  )
			: undefined;

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
			.where(whereCondition)
			.orderBy(desc(posts.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await db
			.select({ count: posts.id })
			.from(posts)
			.where(whereCondition);

		const totalCount = countResult[0]?.count || 0;

		res.json({
			data: allPosts,
			pagination: {
				page,
				limit,
				total: Number(totalCount),
				totalPages: Math.ceil(Number(totalCount) / limit),
			},
		});
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
		const result = createPostSchema.safeParse(req.body);

		if (!result.success) {
			res.status(400).json({
				error: "Validation failed",
				details: result.error.issues,
			});
			return;
		}

		const { title, content } = result.data;

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

		const result = updatePostSchema.safeParse(req.body);

		if (!result.success) {
			res.status(400).json({
				error: "Validation failed",
				details: result.error.issues,
			});
			return;
		}

		const { title, content } = result.data;

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
