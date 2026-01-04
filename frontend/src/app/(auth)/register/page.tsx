"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/features/auth/hooks/use-auth";
import Link from "next/link";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/_components/ui/card";
import { cn } from "@/_utils/cn";
import { Label } from "@radix-ui/react-label";

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
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-50 -z-10" />
			<div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
				<div className="p-8">
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h1>
						<p className="text-gray-500 text-sm">
							Enter your details below to create your account
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium text-gray-700 block">Name</label>
							<input
								id="name"
								placeholder="John Doe"
								{...formRegister("name")}
								type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
							/>
							{errors.name && (
								<p className="text-sm text-red-500 mt-1">{errors.name?.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email</label>
							<input
								id="email"
								placeholder="name@example.com"
								{...formRegister("email")}
								type="email"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
							/>
							{errors.email && (
								<p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
							<input
								id="password"
								{...formRegister("password")}
								type="password"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
							/>
							{errors.password && (
								<p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
							)}
						</div>

						{register.error && (
							<div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
								{(register.error as any)?.response?.data?.error || "Registration failed"}
							</div>
						)}

						<button
							type="submit"
							disabled={register.isPending}
                            className="w-full bg-orange-600 text-white rounded-lg py-2.5 font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
						>
							{register.isPending ? "Creating account..." : "Sign Up"}
						</button>
					</form>
				</div>
				<div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
					<p className="text-sm text-gray-500">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-semibold text-orange-600 hover:text-orange-500 hover:underline"
						>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
