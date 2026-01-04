import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Centralized API client using http-only based auth
export const apiClient = axios.create({
	baseURL: `${API_URL}/api`,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// inteceptors for sending cookie every request + login redirection during 401
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);
