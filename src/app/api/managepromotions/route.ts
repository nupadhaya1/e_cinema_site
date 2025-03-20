import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { promotions } from "~/server/db/schema";

export async function POST(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const promotion = await request.json();
   console.log(promotion);
  // console.log({...promotion, userID: user.userId});
  if (promotion.delete != null && promotion.delete) {
    try {
      await db.delete(promotions).where(eq(promotions.code, promotion.code));
      //console.log("delete" + promotion.id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error inserting promotion:", error);
      return NextResponse.json(
        { error: "Failed to add promotion" },
        { status: 500 },
      );
    }
  } else {
    try {
        let exists = await db.query.promotions.findFirst({
            where: (promotions, { eq }) => eq(promotions.code, promotion.code),
          });
          if(!exists){
            await db.insert(promotions).values({
                ...promotion,
              });
          } else {
        await db.update(promotions).set({
             ...promotion
          }).where(eq(promotions.code, promotion.code));
          }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error inserting promotion:", error);
      return NextResponse.json(
        { error: "Failed to add promotion" },
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
    let promotions = await db.query.promotions.findMany();

    if (!promotions) {
      return NextResponse.json({ error: "promotions not found" }, { status: 404 });
    }

    return NextResponse.json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 },
    );
  }
}