import { apiClient } from "@/core/api/client";
import type { AuthResponse, User } from "@/core/types";

export const authApi = {
	register: async (data: { name: string; email: string; password: string }) => {
		const res = await apiClient.post<AuthResponse>("/auth/register", data);
		return res.data;
	},

	login: async (data: { email: string; password: string }) => {
		const res = await apiClient.post<AuthResponse>("/auth/login", data);
		return res.data;
	},

	logout: async () => {
		const res = await apiClient.post("/auth/logout");
		return res.data;
	},
};
