import { NextResponse } from "next/server";

// Mock user data (replace with DB)
let user = {
  name: "John Doe",
  phone: "123-456-7890",
  address: "123 Main St, City, Country",
};

// GET: Fetch profile data
export async function GET() {
  return NextResponse.json(user);
}

// POST: Update profile data
export async function POST(req: Request) {
  const updatedUser = await req.json();
  
  // Simulate saving to a database
  user = { ...user, ...updatedUser };

  return NextResponse.json({ message: "Profile updated successfully!" });
}
