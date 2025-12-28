import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import { auth } from "./src/middleware/auth.js";
import documentRoutes from "./src/routes/documents.js";
import qaRoutes from "./src/routes/qa.js";  

dotenv.config();
console.log("MONGO_URL:", process.env.MONGO_URL);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);
app.use("/qa", qaRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/private", auth, (req, res) => {
  res.json({ message: "Access granted", user: req.userId });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
