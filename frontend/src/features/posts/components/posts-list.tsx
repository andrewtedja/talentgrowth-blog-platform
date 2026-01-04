"use client";

import { useState } from "react";
import Link from "next/link";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useSearch } from "@/features/posts/hooks/use-search";
import type { PaginatedResponse, Post } from "@/core/types";

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
		<>
			<div className="mb-8">
				<input
					type="text"
					placeholder="Search posts..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
				/>
			</div>

			{isLoading ? (
				<div className="text-center text-gray-500">Loading...</div>
			) : !displayData?.data.length ? (
				<div className="text-center text-gray-500">No posts found</div>
			) : (
				<>
					<div className="space-y-6">
						{displayData.data.map((post) => (
							<Link
								key={post.id}
								href={`/posts/${post.id}`}
								className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-orange-500 transition"
							>
								<h2 className="text-2xl font-semibold text-gray-900 mb-2">
									{post.title}
								</h2>
								<p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
								<div className="flex items-center text-sm text-gray-500">
									<span>{post.author.name}</span>
									<span className="mx-2">•</span>
									<span>{new Date(post.createdAt).toLocaleDateString()}</span>
								</div>
							</Link>
						))}
					</div>

					{displayData.pagination.totalPages > 1 && (
						<div className="flex justify-center gap-2 mt-8">
							<button
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
							>
								Previous
							</button>
							<span className="px-4 py-2">
								Page {page} of {displayData.pagination.totalPages}
							</span>
							<button
								onClick={() => setPage((p) => p + 1)}
								disabled={page >= displayData.pagination.totalPages}
								className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</>
	);
}
