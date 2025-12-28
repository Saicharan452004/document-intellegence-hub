import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import { auth } from "../middleware/auth.js";
import Chunk from "../models/Chunk.js";
import Document from "../models/Document.js";   // ⭐ add this
import axios from "axios";

const router = express.Router();

router.post("/ask", auth, async (req, res) => {
  try {
    const { question } = req.body;

    // 1️⃣ get list of EXISTING documents
    const docs = await Document.find({ userId: req.userId }).select("_id");
    const docIds = docs.map(d => d._id);

    // 2️⃣ only fetch chunks from those docs
    const chunks = await Chunk.find({
      userId: req.userId,
      documentId: { $in: docIds }
    });

    const context = chunks
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8)
      .map(c => c.text)
      .join("\n\n---\n\n");

    // 3️⃣ Stronger instructions (no lists unless requested)
    const prompt = `
You are an AI assistant.

Use ONLY the context below to answer the question.
Answer in 1–3 short sentences.

Do NOT list document excerpts.
Do NOT repeat raw text.
Do NOT use bullet points unless the question explicitly asks for a list.

If the answer is not found in the documents, reply exactly:
"I couldn't find that in the uploaded documents."

Context:
${context}

Question:
${question}

Answer:
`;

    const reply = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You answer strictly from document context. If unsure, say you cannot find the answer."
          },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    res.json({
      answer: reply.data.choices[0].message.content.trim(),
      references: chunks.slice(0, 3).map(c => ({
        documentId: c.documentId,
        excerpt: c.text.slice(0, 200)
      }))
    });
  } catch (err) {
    console.error("QA ERROR:", err?.response?.data || err.message);
    res.status(500).json({ message: "Question failed" });
  }
});

export default router;
