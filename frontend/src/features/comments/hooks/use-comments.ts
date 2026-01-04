import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api";

export function useComments(postId: number) {
	return useQuery({
		queryKey: ["comments", postId],
		queryFn: () => commentsApi.getByPost(postId),
		enabled: !!postId,
	});
}

export function useCreateComment(postId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) => commentsApi.create(postId, content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });
		},
	});
}

export function useUpdateComment(commentId: number, postId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) => commentsApi.update(commentId, content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });
		},
	});
}

export function useDeleteComment(postId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: commentsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });
		},
	});
}
