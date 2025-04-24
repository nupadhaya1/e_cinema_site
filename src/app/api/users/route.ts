import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users, creditCards } from "~/server/db/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

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
      promotions,
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
        promotions: promotions === true || promotions === "true",
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
        cvv: formData.cvv?.trim(), // Ensure cvv is included
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
  const userAuth = await auth();
  if (!userAuth || !userAuth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all users instead of just the requesting user
    const allUsers = await db.query.users.findMany();

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({ users: [] });
    }

    const formattedUsers = await Promise.all(
      allUsers.map(async (user) => {
        try {
          const res = await fetch(
            `https://api.clerk.com/v1/users/${user.userID}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              },
            },
          );

          if (!res.ok) {
            console.error(`Failed to fetch Clerk user ${user.userID}`);
            return null;
          }

          const clerkUser = await res.json();
          const primaryEmail =
            clerkUser.email_addresses?.[0]?.email_address || "N/A";

          return {
            id: user.userID,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phoneNumber || "N/A",
            email: primaryEmail,
            status: user.status || "active", // Add fallback if undefined
            admin: user.isAdmin ? "true" : "false",
          };
        } catch (err) {
          console.error("Error fetching Clerk user:", err);
          return null;
        }
      }),
    );

    // Filter out any null entries from failed fetches
    const usersWithEmails = formattedUsers.filter(Boolean);
    return NextResponse.json({ users: usersWithEmails });

    // return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const userAuth = await auth();
  if (!userAuth || !userAuth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isAdmin, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Update the correct user in the database
    await db
      .update(users)
      .set({
        isAdmin: isAdmin === "true", // Ensure boolean conversion
        status: status, // Store status
      })
      .where(eq(users.userID, id)); // Use `id` from request body instead of `userAuth.userId`

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
