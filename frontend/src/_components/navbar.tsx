"use client";

import Link from "next/link";
import { useAuth } from "@/core/contexts/auth-context";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { Button } from "@/_components/ui/button";
import { cn } from "@/_utils/cn";
import { PenSquare, User, LogOut } from "lucide-react";

export function Navbar() {
	const { user, isAuthenticated } = useAuth();
	const logout = useLogout();

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 py-2 items-center justify-between">
				<div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight">Blogify</span>
                    </Link>
                </div>

				<div className="flex items-center gap-4">
					{isAuthenticated ? (
						<>
							<Link
								href="/posts/create"
								className="flex items-center justify-center rounded-md bg-primary p-2 sm:px-4 sm:py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
							>
								<PenSquare className="h-4 w-4 mr-2" />
                                <span className="sr-only hidden lg:inline">Write</span>
							</Link>

							<Link
								href={`/profile/${user?.id}`}
								className="flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								<User className="mr-2 h-4 w-4" />
								<span className="hidden sm:inline">Profile</span>
							</Link>

							<button
								onClick={() => logout.mutate()}
								className="flex items-center justify-center rounded-md hover:bg-accent hover:text-destructive px-3 py-2 text-sm font-medium text-muted-foreground transition-colors"
							>
								<LogOut className="mr-2 h-4 w-4" />
								<span className="hidden sm:inline">Logout</span>
							</button>
						</>
					) : (
						<div className="flex items-center gap-4">
							<Link
								href="/login"
								className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors px-4 py-2"
							>
								Login
							</Link>
							<Link
								href="/register"
								className="flex items-center justify-center rounded-full bg-orange-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-700 hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0"
							>
								Get Started
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
