import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { users, creditCards } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const card = await request.json();
  // console.log(card);
  // console.log({...card, userID: user.userId});
  if (card.delete != null && card.delete) {
    try {
      await db.delete(creditCards).where(eq(creditCards.id, card.id));
      console.log("delete" + card.id)
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error inserting card:", error);
      return NextResponse.json(
        { error: "Failed to add card" },
        { status: 500 },
      );
    }
  } else {
    try {
      await db.insert(creditCards).values({
        ...card,
        userID: user.userId,
      });
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error inserting card:", error);
      return NextResponse.json(
        { error: "Failed to add card" },
        { status: 500 },
      );
    }
  }
}

export async function GET() {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cards = await db.query.creditCards.findMany({
      where: (creditCards, { eq }) => eq(creditCards.userID, user.userId),
    });

    if (!cards) {
      return NextResponse.json({ error: "cards not found" }, { status: 404 });
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 },
    );
  }
}
