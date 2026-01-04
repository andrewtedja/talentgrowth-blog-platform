import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/core/api/query";
import { AuthProvider } from "@/core/contexts/auth-context";
import { Navbar } from "@/_components/navbar";
import { cn } from "@/_utils/cn";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Blogify | Talent Growth",
	description: "Blog platform for modern developers",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					inter.variable
				)}
			>
				<QueryProvider>
					<AuthProvider>
						<Navbar />
						{children}
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
