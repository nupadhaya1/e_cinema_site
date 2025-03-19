import { db } from "~/server/db";
import { creditCards } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { scrypt, randomFill, createCipheriv } from "node:crypto";
import { scryptSync, createDecipheriv } from "node:crypto";
import { Buffer } from "node:buffer";

const algorithm = "aes-192-cbc";
const password = "hairy dawg";
const salt = "salt"; 

// Encrypt function using async callbacks wrapped in a Promise.
function encrypt(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 24, (err, key) => {
      if (err) return reject(err);
      randomFill(new Uint8Array(16), (err, iv) => {
        if (err) return reject(err);
        const cipher = createCipheriv(algorithm, key, iv);
        let ciphertext = cipher.update(text, "utf8", "hex");
        ciphertext += cipher.final("hex");
        resolve(Buffer.from(iv).toString("hex")+ ciphertext );
      });
    });
  });
}

function decrypt(ciphertext: string): string {
  // IV is the first 32 hex characters (16 bytes) for aes-192-cbc.
  const ivHex = ciphertext.slice(0, 32);
  ciphertext = ciphertext.slice(32);
  const key = scryptSync(password, salt, 24);
  const iv = Buffer.from(ivHex, "hex");
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

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
      //console.log("delete" + card.id);
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
      let encryptedCard = await encrypt(card.cardNumber);
      // console.log(encryptedCard);
      // console.log(decrypt(encryptedCard));
      await db.insert(creditCards).values({
        ...card,
        userID: user.userId,
        cardNumber: encryptedCard,
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
    let cards = await db.query.creditCards.findMany({
      where: (creditCards, { eq }) => eq(creditCards.userID, user.userId),
    });

    if (!cards) {
      return NextResponse.json({ error: "cards not found" }, { status: 404 });
    }

    cards = cards.map((card) => {
      let decryptedCard = decrypt(card.cardNumber);
      // console.log(decryptedCard);
      // console.log({ ...card, cardNumber:  decryptedCard});
      return { ...card, cardNumber:  decryptedCard};
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 },
    );
  }
}
