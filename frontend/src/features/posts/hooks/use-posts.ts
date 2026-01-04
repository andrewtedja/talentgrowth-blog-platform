import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../api";
import { useRouter } from "next/navigation";

export function usePosts(params?: { page?: number; limit?: number; search?: string }) {
	return useQuery({
		queryKey: ["posts", params],
		queryFn: () => postsApi.getAll(params),
	});
}

export function usePost(id: number) {
	return useQuery({
		queryKey: ["posts", id],
		queryFn: () => postsApi.getById(id),
		enabled: !!id,
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: postsApi.create,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			router.push(`/posts/${data.id}`);
		},
	});
}

export function useUpdatePost(id: number) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (data: { title: string; content: string }) =>
			postsApi.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			router.push(`/posts/${id}`);
		},
	});
}

export function useDeletePost() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: postsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			router.push("/");
		},
	});
}
