import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    status: { type: String, default: "processing" },   
    text: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
