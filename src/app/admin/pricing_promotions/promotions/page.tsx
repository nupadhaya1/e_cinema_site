"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { cn } from "~/lib/utils";

// Define the promotion schema
const promotionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  // description: z
  //   .string()
  //   .min(10, { message: "Description must be at least 10 characters" }),
  // discountType: z.enum(["percentage", "fixed", "bogo"]),
  discountValue: z.coerce
    .number()
    .min(0, { message: "Discount value must be positive" }),
  // startDate: z.date(),
  // endDate: z.date(),
  // isActive: z.boolean().default(true),
});

type Promotion = z.infer<typeof promotionSchema>;

export default function PromotionsManager() {
  // Sample initial promotions
  const [promotions, setPromotions] = useState<Promotion[]>([
    // {
    //   id: "1",
    //   name: "Summer Sale",
    //   // description: "20% off all summer items",
    //   // discountType: "percentage",
    //   discountValue: 20,
    //   // startDate: new Date(2025, 5, 1),
    //   // endDate: new Date(2025, 7, 31),
    //   // isActive: true,
    // },
    // {
    //   id: "2",
    //   name: "Welcome Discount",
    //   // description: "Get $10 off your first purchase",
    //   // discountType: "fixed",
    //   discountValue: 10,
    //   // startDate: new Date(2025, 0, 1),
    //   // endDate: new Date(2025, 11, 31),
    //   // isActive: true,
    // },
  ]);

  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize form
  const form = useForm<Promotion>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",
      // description: "",
      // discountType: "fixed",
      discountValue: 0,
      // startDate: new Date(),
      // endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      // isActive: true,
    },
  });

useEffect(() => {
    //setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/managepromotions");
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        setPromotions( result.map((promo:any, index: any) => {
          return {
        name: promo.code,
        id: index,
            discountValue: promo.discount
          };

        }));
       
      } catch (error) {
        //setError(error.message);
      } finally {
        //setIsLoading(false);
      }
    };

    fetchData();
    //setRefresh(false);
  }, []); // Empty dependency array runs effect only once on mount


  // Handle form submission
  const onSubmit = (data: Promotion) => {
    console.log(data);
    if (editingPromotion) {
      // Update existing promotion
      setPromotions(
        promotions.map((p) =>
          p.id === editingPromotion.id
            ? { ...data, id: editingPromotion.id }
            : p,
        ),
      );
    } else {
      // Add new promotion
      setPromotions([...promotions, { ...data, id: Date.now().toString() }]);
    }
    try {
      async function d() {
        await fetch("/api/managepromotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: data.name, discount:data.discountValue }),
      });}
      d();
      
      //setRefresh(true);
    } catch (error) {
      console.log("error deleting promotion: " + error);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  // Edit promotion
  const handleEdit =  async (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset(promotion);

    
    setIsDialogOpen(true);
  };

  // Delete promotion
  const handleDelete = async (name: string) => {
    try {
      setPromotions(promotions.filter((p) => p.name !== name));
      //console.log("click");
      const response = await fetch("/api/managepromotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: name, delete: true }),
      });
      //setRefresh(true);
    } catch (error) {
      console.log("error deleting promotion: " + error);
    }
  };

  // Reset form
  const resetForm = () => {
    form.reset({
      name: "",
      // description: "",
      // discountType: "percentage",
      discountValue: 0,
      // startDate: new Date(),
      // endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      // isActive: true,
    });
    setEditingPromotion(null);
  };

  // Open dialog for new promotion
  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Promotions</h1>
            <Button onClick={handleAddNew}>Add New Promotion</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {/* <TableHead>Type</TableHead> */}
                    <TableHead>Value</TableHead>
                    {/* <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead> */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-4 text-center">
                        No promotions found. Add your first promotion.
                      </TableCell>
                    </TableRow>
                  ) : (
                    promotions.map((promotion) => (
                      <TableRow key={promotion.id}>
                        <TableCell className="font-medium">
                          {promotion.name}
                        </TableCell>
                        {/* <TableCell className="capitalize">
                          {promotion.discountType}
                        </TableCell> */}
                        <TableCell>
                          {/* {promotion.discountType === "percentage"
                            ? `${promotion.discountValue}%`
                            : promotion.discountType === "fixed"
                              ? `$${promotion.discountValue}`
                              : "Buy One Get One"} */}{"$"+promotion.discountValue}
                        </TableCell>
                        {/* <TableCell>
                          {format(promotion.startDate, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(promotion.endDate, "MMM d, yyyy")}
                        </TableCell> */}
                        {/* <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${promotion.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {promotion.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell> */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(promotion)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(promotion.name!)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
                </DialogTitle>
                <DialogDescription>
                  {editingPromotion
                    ? "Update the promotion details below."
                    : "Fill in the details to create a new promotion."}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promotion Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Summer Sale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "active")
                            }
                            defaultValue={field.value ? "active" : "inactive"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>

                  {/* <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the promotion details"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage (%)
                              </SelectItem>
                              <SelectItem value="fixed">
                                Fixed Amount ($)
                              </SelectItem>
                              <SelectItem value="bogo">
                                Buy One Get One
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={
                                // form.watch("discountType") === "percentage"
                                //   ? "20"
                                //   : "10"
                                ""
                              }
                              {...field}
                              // disabled={form.watch("discountType") === "bogo"}
                            />
                          </FormControl>
                          <FormDescription>
                            {/* {form.watch("discountType") === "percentage"
                              ? "Enter percentage value"
                              : form.watch("discountType") === "fixed"
                                ? "Enter dollar amount"
                                : "No value needed for BOGO"} */}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}

                  {/* <DialogFooter> */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" onClick={()=> console.log("click")}>
                      {editingPromotion
                        ? "Update Promotion"
                        : "Create Promotion"}
                    </Button>
                  {/* </DialogFooter> */}
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
