"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { Button } from "~/components/ui/button";
import { UserCog, UserCircle2, Settings } from "lucide-react";
import EditProfileForm from "~/components/editProfile";

function AdminStatus() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStatus() {
      try {
        const res = await fetch("/api/users"); // adjust path if needed
        if (!res.ok) {
          throw new Error("Failed to fetch admin status");
        }
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error fetching admin status:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStatus();
  }, []);

  return (
    isAdmin && (
      <Button
        asChild
        className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
      >
        <Link href="/admin">
          <UserCog className="h-4 w-4" />
          Admin Dashboard
        </Link>
      </Button>
    )
  );
}

export default function SignInSignOutHeader() {
  const { user } = useUser();
  return (
    <main>
      <header className="flex h-16 items-center justify-end gap-4 p-4">
        <SignedOut>
          <SignInButton>
            <Button variant="outline" className="flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" />
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton forceRedirectUrl={"sign-up"}>
            <Button className="flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" />
              Sign up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton>
            <UserButton.UserProfilePage
              label="Additional Settings"
              url="additional-settings"
              labelIcon={<Settings className="h-4 w-4" />}
            >
              <EditProfileForm />
            </UserButton.UserProfilePage>
          </UserButton>
          {user && (
            <div className="text-sm font-medium text-gray-700">
              Hello, {user.firstName}!
            </div>
          )}
          <AdminStatus />
        </SignedIn>
      </header>
    </main>
  );
}
