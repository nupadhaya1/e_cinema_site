"use server";

import sgMail from "@sendgrid/mail";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

// Fetching Clerk data
async function fetchClerkEmail(
  userID: string,
): Promise<{ email: string; name: string } | null> {
  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${userID}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch Clerk user ${userID}`);
      return null;
    }

    const data = await res.json();
    const email = data.email_addresses?.[0]?.email_address;
    const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

    return email ? { email, name } : null;
  } catch (err) {
    console.error("Clerk fetch error:", err);
    return null;
  }
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendPromotionalEmail(subject: string, message: string) {
  const fromEmail = process.env.FROM_EMAIL!;
  let sent = 0;

  // Get all users from DB
  const allUsers = await db.query.users.findMany();

  // Fetch Clerk emails
  const subscribedUsers = (
    await Promise.all(allUsers.map((u) => fetchClerkEmail(u.userID)))
  ).filter(Boolean) as { email: string; name: string }[];

  for (const user of subscribedUsers) {
    const msg = {
      to: user.email,
      from: fromEmail,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    try {
      await sgMail.send(msg);
      sent++;
    } catch (error) {
      console.error(`Failed to send to ${user.email}:`, error);
    }
  }

  return {
    total: subscribedUsers.length,
    sent,
  };
}

export async function sendConfirmationEmail(
  userId: string,
  subject: string,
  body: string,
) {
  const fromEmail = process.env.FROM_EMAIL!;
  let email: string | undefined = (await fetchClerkEmail(userId))?.email;
  if (!email) {
    console.error("no email found for user id: " + userId);
    throw new Error("no email found");
  }
  const msg = {
    to: email,
    from: fromEmail,
    subject,
    text: body,
    html: `<p>${body}</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(`Failed to send confirmation email`, error);
  }
}
