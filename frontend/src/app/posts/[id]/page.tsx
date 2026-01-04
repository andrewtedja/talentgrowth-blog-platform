"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePost, useDeletePost } from "@/features/posts/hooks/use-posts";
import { useComments, useCreateComment, useDeleteComment } from "@/features/comments/hooks/use-comments";
import { useAuth } from "@/core/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const commentSchema = z.object({
	content: z.string().min(1, "Comment cannot be empty").max(500, "Comment too long"),
});

type CommentForm = z.infer<typeof commentSchema>;

export default function PostDetailPage() {
	const params = useParams();
	const router = useRouter();
	const postId = Number(params.id);
	const { user } = useAuth();

	const { data: post, isLoading: postLoading } = usePost(postId);
	const { data: comments, isLoading: commentsLoading } = useComments(postId);
	const deletePost = useDeletePost();
	const createComment = useCreateComment(postId);
	const deleteComment = useDeleteComment(postId);

	const { register, handleSubmit, formState: { errors }, reset } = useForm<CommentForm>({
		resolver: zodResolver(commentSchema),
	});

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const onSubmitComment = (data: CommentForm) => {
		createComment.mutate(data, {
			onSuccess: () => reset(),
		});
	};

	const handleDeletePost = () => {
		deletePost.mutate(postId, {
			onSuccess: () => router.push("/"),
		});
	};

	if (postLoading) {
		return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>;
	}

	if (!post) {
		return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">Post not found</div>;
	}

	const isAuthor = user?.id === post.author.id;

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<article className="bg-white p-8 rounded-lg border border-gray-200 mb-8">
				<div className="flex items-start justify-between mb-4">
					<h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
					{isAuthor && (
						<div className="flex gap-2">
							<Link
								href={`/posts/${post.id}/edit`}
								className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
							>
								Edit
							</Link>
							<button
								onClick={() => setShowDeleteConfirm(true)}
								className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
							>
								Delete
							</button>
						</div>
					)}
				</div>

				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href={`/profile/${post.author.id}`} className="hover:text-orange-500">
						{post.author.name}
					</Link>
					<span>•</span>
					<span>{new Date(post.createdAt).toLocaleDateString()}</span>
				</div>

				<div className="prose prose-slate max-w-none">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
				</div>
			</article>

			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg max-w-md">
						<h3 className="text-lg font-semibold mb-4">Delete Post?</h3>
						<p className="text-gray-600 mb-6">This action cannot be undone.</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={handleDeletePost}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white p-8 rounded-lg border border-gray-200">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">
					Comments ({comments?.length || 0})
				</h2>

				{user ? (
					<form onSubmit={handleSubmit(onSubmitComment)} className="mb-8">
						<textarea
							{...register("content")}
							placeholder="Write a comment..."
							rows={3}
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
						/>
						{errors.content && (
							<p className="text-red-600 text-sm mb-2">{errors.content.message}</p>
						)}
						<button
							type="submit"
							disabled={createComment.isPending}
							className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
						>
							{createComment.isPending ? "Posting..." : "Post Comment"}
						</button>
					</form>
				) : (
					<div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded text-center">
						<Link href="/login" className="text-orange-500 hover:text-orange-600">
							Login to comment
						</Link>
					</div>
				)}

				{commentsLoading ? (
					<div className="text-center text-gray-500">Loading comments...</div>
				) : !comments?.length ? (
					<div className="text-center text-gray-500">No comments yet</div>
				) : (
					<div className="space-y-4">
						{comments.map((comment) => (
							<div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
								<div className="flex items-start justify-between mb-2">
									<div>
										<Link
											href={`/profile/${comment.author.id}`}
											className="font-medium text-gray-900 hover:text-orange-500"
										>
											{comment.author.name}
										</Link>
										<span className="text-sm text-gray-500 ml-2">
											{new Date(comment.createdAt).toLocaleDateString()}
										</span>
									</div>
									{user?.id === comment.author.id && (
										<button
											onClick={() => deleteComment.mutate(comment.id)}
											className="text-sm text-red-600 hover:text-red-700"
										>
											Delete
										</button>
									)}
								</div>
								<p className="text-gray-700">{comment.content}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
