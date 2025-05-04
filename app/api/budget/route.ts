import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Budget from "@/models/Budget";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { category, amount, month, year } = await request.json();

    if (!category || !amount || !month) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingBudget = await Budget.findOne({ category, month, year });

    if (existingBudget) {
      existingBudget.amount += amount;
      await existingBudget.save();

      return NextResponse.json(
        { message: "Budget updated", budget: existingBudget },
        { status: 200 }
      );
    } else {
      const budget = await Budget.create({ category, amount, month, year });
      return NextResponse.json(budget, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create or update budget" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const month = url.searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month query parameter is required" },
        { status: 400 }
      );
    }

    const budgets = await Budget.find({ month }).sort({ category: 1 });
    if (!budgets.length) {
      return NextResponse.json(
        { message: "No budgets found for this month" },
        { status: 404 }
      );
    }

    return NextResponse.json(budgets);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}
