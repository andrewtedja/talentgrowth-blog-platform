import { z } from "zod";

export const createCommentSchema = z.object({
	content: z
		.string()
		.min(1, "Content is required")
		.max(1000, "Content is too long"),
});

export const updateCommentSchema = z.object({
	content: z
		.string()
		.min(1, "Content is required")
		.max(1000, "Content is too long"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
