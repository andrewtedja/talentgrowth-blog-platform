import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api";

export function useUser(id: number) {
	return useQuery({
		queryKey: ["users", id],
		queryFn: () => usersApi.getById(id),
		enabled: !!id,
	});
}

export function useMe() {
	return useQuery({
		queryKey: ["users", "me"],
		queryFn: usersApi.getMe,
	});
}
