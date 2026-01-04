"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/features/auth/hooks/use-auth";
import Link from "next/link";

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const login = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginForm) => {
		login.mutate(data);
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Login
				</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Email
						</label>
						<input
							{...register("email")}
							type="email"
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							{...register("password")}
							type="password"
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
						)}
					</div>

					{login.error && (
						<p className="text-red-500 text-sm">{(login.error as any)?.response?.data?.error || "Login failed"}</p>
					)}

					<button
						type="submit"
						disabled={login.isPending}
						className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
					>
						{login.isPending ? "Logging in..." : "Login"}
					</button>

					<p className="text-center text-sm text-gray-600">
						Don't have an account?{" "}
						<Link href="/register" className="text-orange-500 hover:underline">
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
