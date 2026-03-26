import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { currentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, date, description, category } = await request.json();

    if (!amount || !date || !description || !category) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transaction = await Transaction.create({
      amount,
      date,
      description,
      category,
      userId,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
