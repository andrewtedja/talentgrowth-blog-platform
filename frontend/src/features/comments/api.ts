import { apiClient } from "@/core/api/client";
import type { Comment } from "@/core/types";

export const commentsApi = {
	getByPost: async (postId: number) => {
		const res = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
		return res.data;
	},

	create: async (postId: number, content: string) => {
		const res = await apiClient.post<Comment>(`/posts/${postId}/comments`, {
			content,
		});
		return res.data;
	},

	update: async (id: number, content: string) => {
		const res = await apiClient.put<Comment>(`/comments/${id}`, { content });
		return res.data;
	},

	delete: async (id: number) => {
		const res = await apiClient.delete(`/comments/${id}`);
		return res.data;
	},
};
