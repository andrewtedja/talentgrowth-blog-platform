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

app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
