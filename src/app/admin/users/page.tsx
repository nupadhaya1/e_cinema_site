"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil } from "lucide-react";
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
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { AdminSidebar } from "~/components/admin/admin-sidebar";

// Define the user schema
const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  status: z.enum(["active", "suspended"]),
  admin: z.enum(["true", "false"]),
});

type User = z.infer<typeof userSchema>;

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch users from API on component mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchUsers();
  }, []);

  // Initialize form
  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      status: "active",
      admin: "false",
    },
  });

  // Ensure form updates when editing a user
  useEffect(() => {
    if (editingUser) {
      form.reset(editingUser);
    }
  }, [editingUser, form]);

  // Submit function to update user
  const onSubmit = async (data: User) => {
    if (!editingUser) return;

    const payload = {
      id: editingUser.id, // Ensure the ID is included
      isAdmin: data.admin === "true", // Convert "true"/"false" string to boolean
      status: data.status,
    };

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error updating user:", result.error);
        return;
      }

      console.log("User updated successfully:", result);

      // Update state with the new user data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...data } : user,
        ),
      );

      setIsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Edit user handler
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">Users</h1>

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
                  <TableCell colSpan={6} className="py-4 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Edit User Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    {...form.register("status")}
                    className="w-full rounded border p-2"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <select
                    {...form.register("admin")}
                    className="w-full rounded border p-2"
                  >
                    <option value="true">Admin</option>
                    <option value="false">User</option>
                  </select>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
