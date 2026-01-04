"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePost, useUpdatePost } from "@/features/posts/hooks/use-posts";
import { useEffect } from "react";

const postSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title too long"),
	content: z.string().min(1, "Content is required").max(10000, "Content too long"),
});

type PostForm = z.infer<typeof postSchema>;

export default function EditPostPage() {
	const params = useParams();
	const router = useRouter();
	const postId = Number(params.id);

	const { data: post, isLoading } = usePost(postId);
	const updatePost = useUpdatePost(postId);

	const { register, handleSubmit, formState: { errors }, reset } = useForm<PostForm>({
		resolver: zodResolver(postSchema),
	});

	useEffect(() => {
		if (post) {
			reset({
				title: post.title,
				content: post.content,
			});
		}
	}, [post, reset]);

	const onSubmit = (data: PostForm) => {
		updatePost.mutate(data);
	};

	if (isLoading) {
		return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>;
	}

	if (!post) {
		return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">Post not found</div>;
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<div className="bg-white p-8 rounded-lg border border-gray-200">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Post</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
							Title
						</label>
						<input
							{...register("title")}
							type="text"
							id="title"
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
						{errors.title && (
							<p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
						)}
					</div>

					<div>
						<label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
							Content (Markdown supported)
						</label>
						<textarea
							{...register("content")}
							id="content"
							rows={15}
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
						/>
						{errors.content && (
							<p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
						)}
					</div>

					{updatePost.isError && (
						<div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
							Failed to update post. Please try again.
						</div>
					)}

					<div className="flex gap-3">
						<button
							type="submit"
							disabled={updatePost.isPending}
							className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
						>
							{updatePost.isPending ? "Saving..." : "Save Changes"}
						</button>
						<button
							type="button"
							onClick={() => router.back()}
							className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
