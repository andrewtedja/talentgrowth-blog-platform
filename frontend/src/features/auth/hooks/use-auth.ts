import { useMutation } from "@tanstack/react-query";
import { useAuth as useAuthContext } from "@/core/contexts/auth-context";
import { authApi } from "../api";
import { useRouter } from "next/navigation";

export function useLogin() {
	const { setUser } = useAuthContext();
	const router = useRouter();

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: (data) => {
			setUser(data.user);
			router.push("/");
		},
	});
}

export function useRegister() {
	const { setUser } = useAuthContext();
	const router = useRouter();

	return useMutation({
		mutationFn: authApi.register,
		onSuccess: (data) => {
			setUser(data.user);
			router.push("/");
		},
	});
}

export function useLogout() {
	const { setUser } = useAuthContext();
	const router = useRouter();

	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			setUser(null);
			router.push("/login");
		},
	});
}
