import { apiClient } from "@/core/api/client";
import type { Post, PaginatedResponse } from "@/core/types";

export const postsApi = {
	getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
		const res = await apiClient.get<PaginatedResponse<Post>>("/posts", { params });
		return res.data;
	},

	getById: async (id: number) => {
		const res = await apiClient.get<Post>(`/posts/${id}`);
		return res.data;
	},

	create: async (data: { title: string; content: string }) => {
		const res = await apiClient.post<Post>("/posts", data);
		return res.data;
	},

	update: async (id: number, data: { title: string; content: string }) => {
		const res = await apiClient.put<Post>(`/posts/${id}`, data);
		return res.data;
	},

	delete: async (id: number) => {
		const res = await apiClient.delete(`/posts/${id}`);
		return res.data;
	},
};
