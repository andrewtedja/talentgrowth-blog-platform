"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/features/users/hooks/use-user";
import { Calendar } from "lucide-react";

export default function ProfilePage() {
	const params = useParams();
	const userId = Number(params.id);

	const { data: profile, isLoading } = useUser(userId);

	if (isLoading) {
		return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>;
	}

	if (!profile) {
		return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">User not found</div>;
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<div className="bg-white p-8 rounded-lg border border-gray-200 mb-8">
				<div className="flex items-start justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
						<p className="text-gray-600">{profile.email}</p>
					</div>
					<div className="text-right">
						<div className="text-2xl font-semibold text-orange-500">{profile.postsCount}</div>
						<div className="text-sm text-gray-500">Posts</div>
					</div>
				</div>

				<div className="text-sm text-gray-500">
					Joined {new Date(profile.createdAt).toLocaleDateString()}
				</div>
			</div>

			<div className="bg-white p-8 rounded-lg border border-gray-200">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">Posts by {profile.name}</h2>

				{!profile.posts?.length ? (
					<div className="text-center text-gray-500 py-8">No posts yet</div>
				) : (
					<div className="space-y-4">
						{profile.posts.map((post) => (
							<Link
								key={post.id}
								href={`/posts/${post.id}`}
								className="block"
							>
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50 p-6">
								    <h3 className="text-lg font-semibold leading-none tracking-tight mb-2 group-hover:text-primary">{post.title}</h3>
								    <div className="flex items-center text-sm text-muted-foreground mt-4">
                                        <Calendar className="mr-2 h-4 w-4" />
									    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
								    </div>
                                </div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
