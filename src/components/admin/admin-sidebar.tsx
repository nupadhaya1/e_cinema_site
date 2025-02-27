"use client";

import type * as React from "react";
import { Film, LayoutDashboard, ShoppingCart, User } from "lucide-react";

import { AdminNavMain } from "./admin-nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { title } from "process";

// Admin dashboard navigation data
const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Admin Overview",
          url: "/admin",
        },
      ],
    },
    {
      title: "Movies",
      url: "/admin/movies",
      icon: Film,
      isActive: true,
      items: [
        {
          title: "All Movies",
          url: "/admin/movies",
        },
        {
          title: "Add Movie",
          url: "/admin/movies/add",
        },
      ],
    },
    {
      title: "Pricing & Promos",
      url: "/admin/pricing_promotions/tickets",
      icon: ShoppingCart,
      isActive: true,
      items: [
        {
          title: "Tickets",
          url: "/admin/pricing_promotions/tickets",
        },
        {
          title: "Promotions",
          url: "/admin/pricing_promotions/promotions",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: User,
      isActive: true,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Email Promotions",
          url: "/admin/users/email_promotions",
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <AdminNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
