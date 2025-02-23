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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z
  .object({
    email: z.string(),
    currentPassword: z.string(),
    newPassword: z.string(), //.min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    address: z.string().min(1, "Address is required"),
    promotions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function EditProfileForm() {
  let selectedCard = null;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  const { toast } = useToast();

  //TODO: get defualt values from db
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log("hellow");
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        setUser(result);
      } catch (error) {
        //setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array runs effect only once on mount

  //TODO: get default values from db
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "hairydawg@uga.edu",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      name: "Hairy Dawg",
      phoneNumber: "123-123-1234",
      address: "uga, athens, ga",
      promotions: false,
    },
  });

  //TODO: post to api or something
  async function updateProfile(formData: any) {
    const password = formData.get("password") as string;
    const address = formData.get("address") as string;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    try {
      await updateProfile(values);
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
    <>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Sign up for promotions?</FormLabel>
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

      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>

        <CardContent>
          <SelectCreditCard
            selectedCard={selectedCard}
            setSelectedCard={() => {}}
            disableButtons={true}
          ></SelectCreditCard>
        </CardContent>
      </Card>
    </>
  );
}
