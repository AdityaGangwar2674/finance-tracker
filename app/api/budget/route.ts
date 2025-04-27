import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Budget from "@/models/Budget";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { category, amount, month } = await request.json();

    if (!category || !amount || !month) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const budget = await Budget.create({
      category,
      amount,
      month,
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find().sort({ month: -1, category: 1 }); // sort latest month first
    return NextResponse.json(budgets);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}
