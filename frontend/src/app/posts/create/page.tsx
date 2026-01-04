"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreatePost } from "@/features/posts/hooks/use-posts";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import "easymde/dist/easymde.min.css";

// Dynamic import for SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

const postSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title too long"),
	content: z.string().min(1, "Content is required").max(10000, "Content too long"),
});

type PostForm = z.infer<typeof postSchema>;

export default function CreatePostPage() {
	const router = useRouter();
	const createPost = useCreatePost();

	const { register, control, handleSubmit, formState: { errors } } = useForm<PostForm>({
		resolver: zodResolver(postSchema),
	});

	const editorOptions = useMemo(() => ({
		placeholder: "Write your story here... Markdown is supported.",
		status: false,
		spellChecker: false,
	}), []);

	const onSubmit = (data: PostForm) => {
		createPost.mutate(data);
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-500 hover:text-gray-900 mb-4 flex items-center"
                >
                    ← Back
                </button>
			    <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
            </div>

			<div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					<div className="space-y-2">
						<label htmlFor="title" className="block text-sm font-semibold text-gray-900">
							Title
						</label>
						<input
							{...register("title")}
							type="text"
							id="title"
							placeholder="Enter post title"
							className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder:text-gray-400 text-lg font-medium"
						/>
						{errors.title && (
							<p className="text-red-500 text-sm font-medium">{errors.title.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="content" className="block text-sm font-semibold text-gray-900">
							Content
						</label>
                        <div className="prose-editor">
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <SimpleMDE
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={editorOptions}
                                    />
                                )}
                            />
                        </div>
						{errors.content && (
							<p className="text-red-500 text-sm font-medium">{errors.content.message}</p>
						)}
					</div>

					{createPost.isError && (
						<div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
							{(createPost.error as any)?.response?.data?.error || "Failed to create post. Please try again."}
						</div>
					)}

					<div className="flex gap-4 pt-4 border-t border-gray-100">
						<button
							type="submit"
							disabled={createPost.isPending}
							className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
						>
							{createPost.isPending ? "Publishing..." : "Publish Post"}
						</button>
						<button
							type="button"
							onClick={() => router.back()}
							className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
