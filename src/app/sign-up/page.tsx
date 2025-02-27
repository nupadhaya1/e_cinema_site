"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Phone } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    // const phone = formData.get("phone") as string;

    // if (!phone) {
    //   setIsLoading(false);
    //   return;
    // }

    // Simulate any client-side work, e.g., phone validation or additional logic
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // Call the API route to add the user to the database
    const res = await fetch("/api/users", { method: "POST" });
    if (!res.ok) {
      // Optionally, handle errors here
      console.error("Failed to add user:", await res.json());
      setIsLoading(false);
      return;
    }

    toast.success("Account created successfully!");

    // Redirect to home page after successful account creation
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your phone number to create an account. Card details are
            optional.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Phone Number Section */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="after:ml-0.5 after:text-red-500 after:content-['*']"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 555-5555"
                  className="pl-10"
                  required
                  pattern="^\+?[1-9]\d{1,14}$"
                  title="Please enter a valid phone number"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Required for account creation
              </p>
            </div>

            <Separator />

            {/* Card Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  <h3 className="font-semibold">Card Details</h3>
                </div>
                <span className="text-sm text-muted-foreground">Optional</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Complete Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
