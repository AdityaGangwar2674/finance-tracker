import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Budget from "@/models/Budget";
import { currentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, amount, month, year } = await request.json();

    // Validate all required fields
    if (!category || !amount || !month || !year) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const [yearNum, monthNum] = month.split("-");
    const existingBudget = await Budget.findOne({
      category,
      month: monthNum,
      year: Number(yearNum),
      userId,
    });

    if (existingBudget) {
      existingBudget.amount += amount;
      await existingBudget.save();
      return NextResponse.json(
        { message: "Budget updated", budget: existingBudget },
        { status: 200 },
      );
    } else {
      const budget = await Budget.create({
        category,
        amount,
        month: monthNum,
        year: Number(yearNum),
        userId,
      });
      return NextResponse.json(budget, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create or update budget" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const month = url.searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month query parameter is required" },
        { status: 400 },
      );
    }
    const [year, monthNum] = month.split("-");

    const budgets = await Budget.find({
      month: monthNum,
      year: Number(year),
      userId,
    }).sort({ category: 1 });

    if (!budgets.length) {
      return NextResponse.json(budgets, { status: 200 });
    }

    return NextResponse.json(budgets);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 },
    );
  }
}
