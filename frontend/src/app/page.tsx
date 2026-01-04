import { PostsList } from "@/features/posts/components/posts-list";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getPosts() {
	try {
		const res = await fetch(`${API_URL}/api/posts?page=1&limit=10`, {
			next: { revalidate: 60 },
		});

		if (!res.ok) return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
		return res.json();
	} catch {
		return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
	}
}

export default async function HomePage() {
	const initialData = await getPosts();

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Posts</h1>
			</div>

			<PostsList initialData={initialData} />
		</div>
	);
}
