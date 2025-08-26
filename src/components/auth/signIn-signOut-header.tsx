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

import { Button } from "../ui/button";
import {
  UserCog,
  UserCircle2,
  Settings,
  HomeIcon,
  History,
  Film,
} from "lucide-react";
import EditProfileForm from "../editProfile";

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
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Button
          asChild
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-600 hover:to-orange-600"
        >
          <Link href="/admin">
            <UserCog className="h-4 w-4" />
            Admin Dashboard
          </Link>
        </Button>
      )}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-gray-300 transition-colors duration-200 hover:bg-gray-800/50 hover:text-amber-400"
      >
        <Link href="/orders" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">Orders</span>
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-gray-300 transition-colors duration-200 hover:bg-gray-800/50 hover:text-amber-400"
      >
        <Link href="/" className="flex items-center gap-2">
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </Button>
    </div>
  );
}

export default function SignInSignOutHeader() {
  const { user } = useUser();
  return (
    <main>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Film className="h-6 w-6" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-xl font-bold text-transparent">
              E-Cinema Site
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-amber-400/30 bg-transparent text-amber-400 transition-all duration-200 hover:border-amber-400 hover:bg-amber-400/10"
              >
                <UserCircle2 className="h-4 w-4" />
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl={"sign-up"}>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-600 hover:to-orange-600">
                <UserCircle2 className="h-4 w-4" />
                Sign up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden text-sm font-medium text-gray-300 sm:block">
                  Welcome back,{" "}
                  <span className="font-semibold text-amber-400">
                    {user.firstName}
                  </span>
                  !
                </div>
              )}

              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-8 h-8 ring-2 ring-amber-400/30 hover:ring-amber-400/50 transition-all duration-200",
                      userButtonPopoverCard: "bg-gray-800 border-gray-700",
                      userButtonPopoverActionButton:
                        "text-gray-300 hover:text-amber-400 hover:bg-gray-700/50",
                    },
                  }}
                >
                  <UserButton.UserProfilePage
                    label="Additional Settings"
                    url="additional-settings"
                    labelIcon={<Settings className="h-4 w-4" />}
                  >
                    <EditProfileForm />
                  </UserButton.UserProfilePage>
                </UserButton>

                <AdminStatus />
              </div>
            </div>
          </SignedIn>
        </div>
      </header>
    </main>
  );
}
