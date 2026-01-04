import { apiClient } from "@/core/api/client";
import type { UserProfile } from "@/core/types";

export const usersApi = {
	getById: async (id: number) => {
		const res = await apiClient.get<UserProfile>(`/users/${id}`);
		return res.data;
	},

	getMe: async () => {
		const res = await apiClient.get<UserProfile>("/users/me/profile");
		return res.data;
	},
};
