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
		<nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center justify-between">
				<Link href="/" className="mr-6 flex items-center space-x-2">
					<span className="font-bold sm:inline-block">TalentGrowth</span>
				</Link>

				<div className="flex items-center gap-2 md:gap-4">
					{isAuthenticated ? (
						<>
							<Button variant="ghost" size="sm" asChild className="hidden sm:flex">
								<Link href="/posts/create">
									<PenSquare className="mr-2 h-4 w-4" />
									Write
								</Link>
							</Button>

							<Button variant="ghost" size="icon" asChild className="sm:hidden">
								<Link href="/posts/create">
									<PenSquare className="h-4 w-4" />
                                    <span className="sr-only">Write</span>
								</Link>
							</Button>

							<Button variant="ghost" size="sm" asChild>
								<Link href={`/profile/${user?.id}`}>
                                    <User className="mr-2 h-4 w-4" />
									Profile
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => logout.mutate()}
							>
                                <LogOut className="mr-2 h-4 w-4" />
								Logout
							</Button>
						</>
					) : (
						<>
							<Button variant="ghost" size="sm" asChild>
								<Link href="/login">Login</Link>
							</Button>
							<Button size="sm" asChild>
								<Link href="/register">Get Started</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
