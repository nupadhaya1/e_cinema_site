"use client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { Separator } from "~/components/ui/separator";
import { Film, Users, Tag } from "lucide-react";
import Link from "next/link";

const dashboardItems = [
  {
    title: "Manage Movies",
    description: "Add, edit, and delete movies",
    icon: Film,
    href: "admin/movies",
  },
  {
    title: "Manage Pricing and Promotions",
    description: "Create and manage promotional offers. Edit ticket prices.",
    icon: Tag,
    href: "admin/pricing_promotions/tickets",
  },
  {
    title: "Manage Users",
    description: "Manage user accounts and permissions",
    icon: Users,
    href: "/admin/users",
  },
];

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <button
          onClick={async () => {
            try {
              const res = await fetch("/api/clerk-user"); // No auth needed on client
              const data = await res.json();
              console.log("User data:", data);
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          }}
        >
          Test Request
        </button>
        <header className="flex h-16 shrink-0 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto"></div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardItems.map((item) => (
              <Card key={item.title} className="h-full">
                <Link href={item.href} className="flex h-full flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.title}
                    </CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
