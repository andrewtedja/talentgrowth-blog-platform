import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/core/api/query";
import { AuthProvider } from "@/core/contexts/auth-context";

export const metadata: Metadata = {
	title: "Talent Growth Blog",
	description: "Blog platform for talent growth internship",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<QueryProvider>
					<AuthProvider>{children}</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
