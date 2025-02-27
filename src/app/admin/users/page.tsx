"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "~/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { AdminSidebar } from "~/components/admin/admin-sidebar";

// Define the user schema
const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  status: z.enum(["active", "suspended"]),
  admin: z.enum(["true", "false"]),
});

type User = z.infer<typeof userSchema>;

export default function UsersManager() {
  // State for storing user data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "123-456-7890",
      email: "johnDoe123@gmail.com",
      password: "********",
      status: "active",
      admin: "true",
    },
    {
      id: "2",
      name: "Bob Doe",
      phone: "123-456-7890",
      email: "bobroberts123@gmail.com",
      password: "********",
      status: "suspended",
      admin: "false",
    },
  ]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize form
  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      status: "active",
      admin: "false",
    },
  });

  // Handle form submission (Add / Edit User)
  const onSubmit = (data: User) => {
    if (editingUser) {
      // Update existing user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...data, id: editingUser.id } : user,
        ),
      );
    } else {
      // Add new user
      setUsers([...users, { ...data, id: Date.now().toString() }]);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  // Edit user
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset(user);
    setIsDialogOpen(true);
  };

  // Delete user
  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Reset form
  const resetForm = () => {
    form.reset({
      name: "",
      phone: "",
      email: "",
      password: "",
      status: "active",
      admin: "false",
    });
    setEditingUser(null);
  };

  // Open dialog for new user
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
                  <BreadcrumbLink href="/admin/users"> Users</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto"></div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">Users</h1>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-4 text-center">
                        No users found. Add your first user.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status === "active" ? "Active" : "Suspended"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 ${
                              user.admin === "true"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.admin === "true" ? "Admin" : "User"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(user.id!)}
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
                  {editingUser ? "Edit User" : "Add New User"}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <label className="block text-sm font-medium">Full Name</label>
                <Input {...form.register("name")} placeholder="Full Name" />

                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <Input {...form.register("phone")} placeholder="Phone Number" />

                <label className="block text-sm font-medium">Email</label>
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="Email"
                />

                <label className="block text-sm font-medium">Password</label>
                <Input
                  {...form.register("password")}
                  type="password"
                  placeholder="Password"
                />

                <label className="block text-sm font-medium">Status</label>
                <select
                  {...form.register("status")}
                  className="w-full rounded border p-2"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>

                <label className="block text-sm font-medium">Role</label>
                <select
                  {...form.register("admin")}
                  className="w-full rounded border p-2"
                >
                  <option value="true">Admin</option>
                  <option value="false">User</option>
                </select>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingUser ? "Update User" : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
