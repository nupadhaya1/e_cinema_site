import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users, creditCards } from "~/server/db/schema";
import { useUser } from "@clerk/nextjs";

import { scrypt, randomFill, createCipheriv } from "node:crypto";
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
        resolve(Buffer.from(iv).toString("hex") + ciphertext);
      });
    });
  });
}

export async function POST(request: Request) {
  const userAuth = await auth();
  if (!userAuth || !userAuth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const {
      firstName,
      lastName,
      phone,
      hasAllCardInfo,
      cardName,
      cardNumber,
      expiry,
      address,
      cardType,
    } = formData;

    // Validate required fields
    if (!firstName || firstName.trim() === "") {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 },
      );
    }

    if (!lastName || lastName.trim() === "") {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 },
      );
    }

    if (!phone || phone.trim() === "") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    await db
      .insert(users)
      .values({
        userID: userAuth.userId,
        isAdmin: false,
        phoneNumber: phone,
        firstName: firstName.trim(), // Ensure no leading/trailing spaces
        lastName: lastName.trim(),
      })
      .catch((error) => {
        console.error("Database error:", error);
        throw new Error("Database operation failed");
      });

    if (!hasAllCardInfo) {
      return NextResponse.json({ success: true });
    }

    let encryptedCard = await encrypt(cardNumber);
    await db
      .insert(creditCards)
      .values({
        userID: userAuth.userId,
        cardNumber: encryptedCard.trim(),
        cardName: cardName.trim(),
        cardType: cardType.trim(),
        exp: expiry.trim(),
        address: address.trim(),
      })
      .catch((error) => {
        console.error("credit card error:", error);
        throw new Error("credit card operation failed");
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function GET() {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.userID, user.userId),
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ isAdmin: userData.isAdmin });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 },
    );
  }
}
