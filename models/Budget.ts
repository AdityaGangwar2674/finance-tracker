import mongoose, { Schema } from "mongoose";

const BudgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
