import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import SignInSignOutHeader from "~/components/auth/signIn-signOut-header";

export const metadata: Metadata = {
  title: "E-Cinema Booking",
  description: "UGA CS 4050 E-Cinema Booking Project",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <SignInSignOutHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
