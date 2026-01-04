export interface User {
	id: number;
	name: string;
	email: string;
	createdAt: string;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	author: User;
}

export interface Comment {
	id: number;
	content: string;
	createdAt: string;
	updatedAt: string;
	author: User;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface AuthResponse {
	message: string;
	user: User;
	token: string;
}

export interface UserProfile extends User {
	postsCount: number;
	posts: Pick<Post, "id" | "title" | "createdAt">[];
}
