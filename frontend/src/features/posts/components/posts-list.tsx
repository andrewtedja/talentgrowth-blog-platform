"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useSearch } from "@/features/posts/hooks/use-search";
import type { PaginatedResponse, Post } from "@/core/types";
import { Button } from "@/_components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/_components/ui/skeleton";

interface PostsListProps {
	initialData: PaginatedResponse<Post>;
}

export function PostsList({ initialData }: PostsListProps) {
	const [page, setPage] = useState(1);
	const { search, setSearch, debouncedSearch } = useSearch();
	const { data, isLoading } = usePosts(
		{
			page,
			limit: 10,
			search: debouncedSearch || undefined,
		},
		initialData
	);

	const displayData = data || initialData;

	return (
		<div className="space-y-8">
           <div className="relative mx-auto w-full max-w-xl mb-6">

                <input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full rounded-xl border border-border bg-background py-4 pl-12 px-4 text-sm placeholder:text-muted-foreground shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary hover:shadow-md`}
                />
                </div>
			{isLoading ? (
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="flex flex-col space-y-3">
							<Skeleton className="h-[200px] w-full rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						</div>
					))}
				</div>
			) : !displayData?.data.length ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
					<div className="rounded-full bg-gray-100 p-3 mb-4">
						<Search className="h-6 w-6 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900">No posts found</h3>
					<p className="text-gray-500 max-w-sm mt-1">
						We couldn't find any articles matching your criteria. Try different keywords.
					</p>
				</div>
			) : (
				<>
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
						{displayData.data.map((post) => (
							<Link
								key={post.id}
								href={`/posts/${post.id}`}
								className="group mb-4 flex flex-col h-full bg-white rounded-2xl border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 overflow-hidden"
							>
								<div className="p-6 flex-1 flex flex-col">
									<div className="flex items-center gap-2 mb-4">
										<div className="flex flex-col">
											<span className="text-sm font-semibold text-gray-900 leading-none mb-1">
												{post.author.name}
											</span>
											<span className="text-xs text-gray-500">
												{new Date(post.createdAt).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
											</span>
										</div>
									</div>

									<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
										{post.title}
									</h3>

									<div className="text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed prose prose-sm max-w-none prose-p:my-0 prose-headings:my-1">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} allowedElements={["p", "strong", "em", "code", "span"]}>
										    {post.content}
                                        </ReactMarkdown>
									</div>

									<div className="flex items-center text-sm font-medium text-orange-600 mt-auto group-hover:underline decoration-2 underline-offset-4 w-fit">
										Read article
										<svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
										</svg>
									</div>
								</div>
							</Link>
						))}
					</div>

					{displayData.pagination.totalPages > 1 && (
						<div className="flex items-center justify-center gap-3 pt-8 pb-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
                                className="border-gray-200 hover:bg-gray-50 text-gray-700"
							>
								Previous
							</Button>
							<span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
								Page {page} of {displayData.pagination.totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p + 1)}
								disabled={page >= displayData.pagination.totalPages}
                                className="border-gray-200 hover:bg-gray-50 text-gray-700"
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
