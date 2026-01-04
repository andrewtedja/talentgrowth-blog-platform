"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/features/auth/hooks/use-auth";
import Link from "next/link";

const registerSchema = z.object({
	name: z.string().min(1, "Name required").max(30),
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const register = useRegister();
	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = (data: RegisterForm) => {
		register.mutate(data);
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Create Account
				</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Name
						</label>
						<input
							{...formRegister("name")}
							type="text"
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Email
						</label>
						<input
							{...formRegister("email")}
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
							{...formRegister("password")}
							type="password"
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
						)}
					</div>

					{register.error && (
						<p className="text-red-500 text-sm">{(register.error as any)?.response?.data?.error || "Registration failed"}</p>
					)}

					<button
						type="submit"
						disabled={register.isPending}
						className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
					>
						{register.isPending ? "Creating account..." : "Sign Up"}
					</button>

					<p className="text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link href="/login" className="text-orange-500 hover:underline">
							Login
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
