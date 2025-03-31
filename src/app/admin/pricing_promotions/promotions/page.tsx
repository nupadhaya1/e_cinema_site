"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Trash2, Mail } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
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

// Define the promotion schema
const promotionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),

  discountValue: z.coerce
    .number()
    .min(0, { message: "Discount value must be positive" }),
});

type Promotion = z.infer<typeof promotionSchema>;

export default function PromotionsManager() {
  // Sample initial promotions
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize form
  const form = useForm<Promotion>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",

      discountValue: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/managepromotions");
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        setPromotions(
          result.map((promo: any) => ({
            name: promo.code,
            id: promo.id.toString(),
            discountValue: promo.discount,
          })),
        );
      } catch (error) {
      } finally {
      }
    };

    fetchData();
  }, []); // Empty dependency array runs effect only once on mount

  const handleCreate = async (data: Promotion) => {
    const payload = {
      code: data.name,
      discount: data.discountValue,
    };

    try {
      await fetch("/api/managepromotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setPromotions([...promotions, { ...data, id: Date.now().toString() }]);
    } catch (error) {
      console.error("Error creating promotion:", error);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = async (data: Promotion) => {
    console.log(editingPromotion);

    handleDelete(editingPromotion?.name!);

    const payload = {
      id: editingPromotion?.id,
      code: data.name,
      discount: data.discountValue,
    };

    try {
      const res = await fetch("/api/managepromotions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPromotions(
          promotions.map((p) =>
            p.id === editingPromotion?.id
              ? { ...data, id: editingPromotion?.id || "" }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating promotion:", error);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  // Edit promotion
  const handleEdit = async (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset(promotion);
    setIsDialogOpen(true);
  };

  // Delete promotion
  const handleDelete = async (name: string) => {
    try {
      setPromotions(promotions.filter((p) => p.name !== name));
      const response = await fetch("/api/managepromotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: name, delete: true }),
      });
    } catch (error) {
      console.log("error deleting promotion: " + error);
    }
  };

  // Reset form
  const resetForm = () => {
    form.reset({
      name: "",
      discountValue: 0,
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
                    <TableHead>Value</TableHead>

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

                        <TableCell>{"$" + promotion.discountValue}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                window.open(
                                  `/admin/pricing_promotions/email_promotions?promo=${encodeURIComponent(promotion.name)}`,
                                  "_blank",
                                )
                              }
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
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
                  onSubmit={form.handleSubmit(handleCreate)}
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
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder={""} {...field} />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  {editingPromotion ? (
                    <Button
                      onClick={() => {
                        console.log("updating promo", form.getValues());
                        handleUpdate(form.getValues());
                      }}
                    >
                      Update Promotion
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      onClick={() => console.log("creating promo")}
                    >
                      Create Promotion
                    </Button>
                  )}
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
