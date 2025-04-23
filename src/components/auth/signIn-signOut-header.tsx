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
import { UserCog, UserCircle2, Settings, HomeIcon, History } from "lucide-react";
import EditProfileForm from "~/components/editProfile";

function AdminStatus() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStatus() {
      try {
        const res = await fetch("/api/isadmin/"); // adjust path if needed
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Failed to fetch admin status:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStatus();
  }, []);

  return (
    <div className="flex items-center gap-4">
      {isAdmin && (
        <Button
          asChild
          className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
        >
          <Link href="/admin">
            <UserCog className="h-4 w-4" />
            Admin Dashboard
          </Link>
        </Button>
      )}
     <Button asChild className="">
        <Link href="/orders">
        <History className="h-4 w-4"/>
        </Link>
      </Button>
      <Button asChild className="">
        <Link href="/">
          <HomeIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default function SignInSignOutHeader() {
  const { user } = useUser();
  return (
    <main>
      <header className="flex h-16 items-center justify-end gap-4 bg-gray-200 p-4">
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
          {user && (
            <div className="text-sm font-medium text-gray-700">
              Hello, {user.firstName}!
            </div>
          )}
          <UserButton>
            <UserButton.UserProfilePage
              label="Additional Settings"
              url="additional-settings"
              labelIcon={<Settings className="h-4 w-4" />}
            >
              <EditProfileForm />
            </UserButton.UserProfilePage>
          </UserButton>

          <AdminStatus />
        </SignedIn>
      </header>
    </main>
  );
}
