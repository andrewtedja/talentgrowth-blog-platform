import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import userRoutes from "./routes/users";

// Express application bootstrap
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
	"http://localhost:3000",
	"https://talentgrowth-blog-platform.vercel.app",
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error(`Origin ${origin} not allowed by CORS`));
			}
		},
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT} !!!`);
});
