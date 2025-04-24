"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Phone, MapPin } from "lucide-react";
import { useUser } from "@clerk/nextjs";
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
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    const cardName = formData.get("cardName") as string;
    const cardNumber = formData.get("cardNumber") as string;
    const expiry = formData.get("expiry") as string;
    const cvc = formData.get("cvc") as string;
    const address = formData.get("address") as string;
    const cardType = formData.get("cardType") as string; // Added Card Type
    const promotions = formData.get("promotions") === "on";

    if (!user) {
      toast.error("Please sign in to create an account.");
      setIsLoading(false);
      return;
    }

    const firstName = user.firstName;
    const lastName = user.lastName;

    // Ensure either all card fields (including address and card type) are filled or none
    const cardDetails = [cardName, cardNumber, expiry, cvc, address, cardType];
    const hasSomeCardInfo = cardDetails.some((field) => field.trim() !== "");
    const hasAllCardInfo = cardDetails.every((field) => field.trim() !== "");

    if (hasSomeCardInfo && !hasAllCardInfo) {
      toast.error(
        "Please fill out all card details (including address and card type) or leave them all empty.",
      );
      setIsLoading(false);
      return;
    }

    try {
      // First, create the user
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          cardName,
          cardNumber,
          expiry,
          address,
          cardType,
          hasAllCardInfo,
          promotions,
        }),
      });

      if (!userRes.ok) {
        const errorData = await userRes.json();
        toast.error(errorData.error || "Failed to create user account.");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                  name="phone"
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

            {/* Promotions Checkbox Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="promotions"
                  name="promotions"
                  className="h-4 w-4"
                />
                <Label htmlFor="promotions" className="text-sm font-medium">
                  Sign up for promotional emails?
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                You can unsubscribe at any time.
              </p>
            </div>

            <Separator />

            {/* Card Details Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  <h3 className="font-semibold">Card Details</h3>
                </div>
                <span className="text-sm text-muted-foreground">Optional</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" name="cardName" placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>

              {/* Card Type Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="cardType">Card Type</Label>
                <select
                  id="cardType"
                  name="cardType"
                  className="w-full rounded border p-2"
                >
                  <option value="">Select Card Type</option>
                  <option value="visa">VISA</option>
                  <option value="mastercard">MASTERCARD</option>
                  <option value="discover">DISCOVER</option>
                  <option value="amex">AMEX</option>
                </select>
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address">Billing Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, Country"
                    className="pl-10"
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
