import { db } from "~/server/db";
import { prices } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const newPrices = await request.json();
    await db.update(prices).set(newPrices).where(eq(prices.id, newPrices.id));
    return NextResponse.json(
      { message: "Prices updated sucessfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating prices: ", error);
    return NextResponse.json(
      { error: "Failed to update prices " },
      { status: 500 },
    );
  }
}

export async function GET() {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    let prices = await db.query.prices.findFirst({
      where: (prices, { eq }) => eq(prices.id, 6),
    });

    if (!prices) {
      return NextResponse.json({ error: "cards not found" }, { status: 404 });
    }

    return NextResponse.json(prices);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 },
    );
  }
}
