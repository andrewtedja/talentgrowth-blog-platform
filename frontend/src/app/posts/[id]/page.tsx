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
import { Skeleton } from "@/_components/ui/skeleton";
import { Button } from "@/_components/ui/button";
import { Textarea } from "@/_components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Calendar, User, Trash2, Edit } from "lucide-react";
import { cn } from "@/_utils/cn";

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
		createComment.mutate(data.content, {
			onSuccess: () => reset(),
		});
	};

	const handleDeletePost = () => {
		deletePost.mutate(postId, {
			onSuccess: () => router.push("/"),
		});
	};



	if (postLoading) {
		return (
            <div className="container max-w-4xl py-12 space-y-12">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-3/4" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        );
	}

	if (!post) {
		return <div className="container max-w-4xl py-12 text-center text-muted-foreground">Post not found</div>;
	}

	const isAuthor = user?.id === post.author.id;

	return (
		<div className="container max-w-3xl py-12 space-y-12">
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
                >
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to posts
                </button>

                <article>
                    <header className="space-y-6 mb-12">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                            <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">Article</span>
                            <span>•</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>

                        <h1 className="text-4xl px-0 md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                            <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3 group">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm ring-4 ring-orange-50 group-hover:ring-orange-100 transition-all">
                                    {post.author.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                        {post.author.name}
                                    </div>
                                    <div className="text-xs text-gray-500">Author</div>
                                </div>
                            </Link>

                            {isAuthor && (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" asChild className="h-9">
                                        <Link href={`/posts/${post.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-9"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="prose prose-lg prose-slate max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-p:leading-relaxed prose-p:text-gray-600
                        prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                        prose-img:rounded-xl prose-img:shadow-md">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                    </div>
                </article>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your post.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeletePost}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

			<div className="space-y-8">
				<h3 className="text-2xl font-bold tracking-tight">
					Comments ({comments?.length || 0})
				</h3>

				{user ? (
					<form onSubmit={handleSubmit(onSubmitComment)} className="space-y-4">
						<Textarea
							{...register("content")}
							placeholder="Share your thoughts..."
							rows={3}
                            className={cn(errors.content && "border-red-500")}
						/>
						{errors.content && (
							<p className="text-sm text-destructive font-medium">{errors.content.message}</p>
						)}
						<Button type="submit" disabled={createComment.isPending}>
							{createComment.isPending ? "Posting..." : "Post Comment"}
						</Button>
					</form>
				) : (
					<div className="rounded-lg border bg-muted/50 p-8 text-center">
                        <p className="text-muted-foreground mb-4">Join the discussion</p>
						<Button asChild variant="outline">
                            <Link href="/login">Login to comment</Link>
                        </Button>
					</div>
				)}

				{commentsLoading ? (
					<div className="text-center text-muted-foreground">Loading comments...</div>
				) : !comments?.length ? (
					<div className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</div>
				) : (
					<div className="space-y-6">
						{comments.map((comment) => (
							<div key={comment.id} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
								<div className="flex-1 space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Link
												href={`/profile/${comment.author.id}`}
												className="font-semibold hover:underline"
											>
												{comment.author.name}
											</Link>
											<span className="text-sm text-muted-foreground">
												{new Date(comment.createdAt).toLocaleDateString()}
											</span>
										</div>
										{user?.id === comment.author.id && (
											<Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-1 text-destructive hover:text-destructive hover:bg-destructive/10"
												onClick={() => deleteComment.mutate(comment.id)}
											>
												Delete
											</Button>
										)}
									</div>
									<p className="text-sm leading-relaxed">{comment.content}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
