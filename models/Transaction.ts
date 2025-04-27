import mongoose, { Schema, Document } from "mongoose";

export interface TransactionType extends Document {
  amount: number;
  date: Date;
  description: string;
  category?: string; // 👈 optional
}

const TransactionSchema = new Schema<TransactionType>(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    category: { type: String }, // 👈 optional now
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model<TransactionType>("Transaction", TransactionSchema);
