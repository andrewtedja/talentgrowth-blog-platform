"use client";

import Link from "next/link";
import { useAuth } from "@/core/contexts/auth-context";
import { useLogout } from "@/features/auth/hooks/use-auth";

export function Navbar() {
	const { user, isAuthenticated } = useAuth();
	const logout = useLogout();

	return (
		<nav className="bg-white border-b border-gray-200">
			<div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
				<Link href="/" className="text-xl font-semibold text-gray-900">
					TalentGrowth
				</Link>

				<div className="flex items-center gap-6">
					{isAuthenticated ? (
						<>
							<Link href="/posts/create" className="text-gray-700 hover:text-orange-500">
								Create Post
							</Link>
							<Link href={`/profile/${user?.id}`} className="text-gray-700 hover:text-orange-500">
								Profile
							</Link>
							<button
								onClick={() => logout.mutate()}
								className="text-gray-700 hover:text-orange-500"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link href="/login" className="text-gray-700 hover:text-orange-500">
								Login
							</Link>
							<Link
								href="/register"
								className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
