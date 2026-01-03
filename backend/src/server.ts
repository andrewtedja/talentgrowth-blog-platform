import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";

// Express application bootstrap
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global middleware (applied to all routes)
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT} !!!`);
});
