import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(1, "Name is required").max(30, "Name is too long"),
	email: z.email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, "Password must be atleast 8 characters")
		.max(72, ""),
});

export const loginSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
