"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Save } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "~/components/ui/sidebar";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";

const formSchema = z.object({
  adultPrice: z.coerce.number().positive("Price must be positive"),
  childPrice: z.coerce.number().positive("Price must be positive"),
  seniorPrice: z.coerce.number().positive("Price must be positive"),
  bookingFee: z.coerce
    .number()
    .min(0, "Fee cannot be negative")
    .max(100, "Fee cannot exceed 100%"),
});

export default function PricingForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adultPrice: 20,
      childPrice: 15,
      seniorPrice: 10,
      bookingFee: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Saved values:", values);

    toast({
      title: "Prices updated successfully",
      description: "The new ticket prices and booking fee have been saved.",
      action: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
          <Check className="h-4 w-4 text-white" />
        </div>
      ),
    });

    setIsSaving(false);
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/pricing_promotions">
                    Pricing & Promos
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Promotions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto"></div>
        </header>
        <Card className="w-full rounded-none border-none">
          <CardHeader>
            <CardTitle>Ticket Pricing</CardTitle>
            <CardDescription>
              Set ticket prices and booking fees for your venue.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="adultPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adult Ticket Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child Ticket Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seniorPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senior Ticket Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bookingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Online Booking Fee (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Percentage fee applied to all online bookings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
