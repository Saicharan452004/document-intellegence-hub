import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse-fixed";
import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.delete("/:id", auth, async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);

    await Chunk.deleteMany({
      userId: req.userId,
      documentId: req.params.id
    });

    res.json({ message: "Document and chunks deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    let text = "";

    // PDF
    if (file.mimetype === "application/pdf") {
      const data = await pdf(fs.readFileSync(file.path));
      text = data.text || "";
    }
    // TXT or others
    else {
      text = fs.readFileSync(file.path, "utf8");
    }

    // save main document
    const doc = await Document.create({
      userId: req.userId,
      name: file.originalname,
      text,
      status: "done"
    });

    const chunkSize = 800;

    for (let i = 0; i < text.length; i += chunkSize) {
      await Chunk.create({
        userId: req.userId,
        documentId: doc._id,
        text: text.slice(i, i + chunkSize)
      });
    }

    res.json({ message: "Uploaded", document: doc });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});


router.get("/", auth, async (req, res) => {
  const docs = await Document.find({ userId: req.userId }).sort({
    createdAt: -1
  });

  res.json(docs);
});

export default router;
