"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { sendPromotionalEmail } from "~/actions/email-actions";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function EmailForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [stats, setStats] = useState<{ total: number; sent: number } | null>(
    null,
  );

  const searchParams = useSearchParams();
  const promoParam = searchParams.get("promo");

  useEffect(() => {
    if (promoParam) {
      setMessage(
        `Use promo code "${promoParam}" to get your exclusive discount!`,
      );
      setSubject(`Exclusive Offer: ${promoParam}`);
    }
  }, [promoParam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      return;
    }

    setStatus("loading");

    try {
      const result = await sendPromotionalEmail(subject, message);
      setStats(result);
      setStatus("success");

      setTimeout(() => {
        setSubject("");
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Failed to send emails:", error);
      setStatus("error");
    }
  }

  return (
    <Card className="w-full rounded-none border-none">
      <CardHeader>
        <CardTitle>Send Promotional Email</CardTitle>
        <CardDescription>
          Compose and send promotional emails to all subscribed users.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Email Message</Label>
            <Textarea
              id="message"
              placeholder="Compose your promotional message here..."
              className="min-h-[200px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          {status === "success" && (
            <Alert variant="default" className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your promotional email has been sent to {stats?.sent} out of{" "}
                {stats?.total} subscribed users.
              </AlertDescription>
            </Alert>
          )}
          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was a problem sending your promotional email. Please try
                again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={
              status === "loading" || !subject.trim() || !message.trim()
            }
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Promotional Email"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
