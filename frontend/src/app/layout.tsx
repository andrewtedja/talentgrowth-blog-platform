import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/core/api/query";
import { AuthProvider } from "@/core/contexts/auth-context";
import { Navbar } from "@/_components/navbar";

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
			<body>
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
