"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		if (typeof window === "undefined") return null;
		const stored = localStorage.getItem("user");
		return stored ? JSON.parse(stored) : null;
	});

	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}
