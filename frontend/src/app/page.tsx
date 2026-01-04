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
		<div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
			<section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-slate-50 border-b">
				<div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
					<h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-slate-900">
						Ideas that <span className="text-primary">Inspire</span>
					</h1>
					<p className="max-w-[42rem] leading-normal text-slate-500 sm:text-xl sm:leading-8">
						A modern platform for developers, designers, and creators to share knowledge and connect with the community.
					</p>
					<div className="space-x-4">
					</div>
				</div>
			</section>

			<section id="posts" className="container max-w-5xl py-12 md:py-16">
				<div className="mx-auto max-w-4xl space-y-8">
                    <div className="flex flex-col space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
                        <p className="text-muted-foreground">Read the latest articles from our community.</p>
                    </div>
					<PostsList initialData={initialData} />
				</div>
			</section>
		</div>
	);
}
