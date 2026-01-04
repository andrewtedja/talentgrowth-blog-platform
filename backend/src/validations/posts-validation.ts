import { z } from "zod";

export const createPostSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	content: z
		.string()
		.min(1, "Content is required")
		.max(10000, "Content is too long"),
});

export const updatePostSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title is too long")
		.optional(),
	content: z
		.string()
		.min(1, "Content is required")
		.max(10000, "Content is too long")
		.optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
