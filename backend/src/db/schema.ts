import {
	integer,
	text,
	serial,
	timestamp,
	date,
	pgTable,
	index,
} from "drizzle-orm/pg-core";

// Drizzle ORM for users, posts, and comments table

export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		password: text("password").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		emailIdx: index("email_idex").on(table.email),
	})
);

export const posts = pgTable(
	"posts",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		content: text("content").notNull(),
		authorId: integer("author_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		authorIdx: index("posts_author_idx").on(table.authorId),
		createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
	})
);

export const comments = pgTable(
	"comments",
	{
		id: serial("id").primaryKey(),
		content: text("content").notNull(),
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		authorId: integer("author_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		postIdx: index("comments_post_idx").on(table.postId),
		authorIdx: index("comments_author_idx").on(table.authorId),
	})
);
