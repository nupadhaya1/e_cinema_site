//Registered user must be able to view and modify their user profile at any time. They may also change their password. However, users cannot change their email address.
//The system must allow web users to register for the system. To register, users should provide their password, personal information (name, phone number, email address, and password).
///They might optionally, provide payment information (card type, number, and expiration date, and billing address) and home address info (street, city, state and zip code).
//Users can provide only one shipping address and a maximum of three payments cards.
//Registered users can subscribe/unsubscribe for promotions and offered by the system administrator.
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { useToast } from "../hooks/use-toast";
import { useEffect } from "react";
import SelectCreditCard from "./booking/selectCreditCard";
import { Card, CardContent } from "./ui/card";
import isMobilePhone from "validator/lib/isMobilephone";

const formSchema = z.object({
  phoneNumber: z.string().refine(isMobilePhone),
  address: z.string().min(1, "Address is required"),
  promotions: z.boolean(),
});

export default function EditProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      address: "",
      promotions: false,
    },
  });

  //TODO: get defualt values from db
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        form.reset(result);
      } catch (error) {
        //setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setRefresh(false);
  }, [refresh]); // Empty dependency array runs effect only once on mount

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    //console.log(values);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      setRefresh(true);
      form.reset(values);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-11/12 space-y-4">
      <h1 className="text-l font-bold">Edit Profile</h1>
      <hr className="" />
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promotions"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="mt-2">
                      Sign up for promotions?
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SelectCreditCard
        selectedCard={null}
        setSelectedCard={() => {}}
        disableButtons={true}
        handleConfirmBooking={() => new Promise(() => null)}
      ></SelectCreditCard>
    </main>
  );
}
