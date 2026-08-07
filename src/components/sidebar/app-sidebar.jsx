"use client";

import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { SidebarHeaderRole } from "@/components/sidebar/siderbar-header-role";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Gauge } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const data = React.useMemo(
    () => ({
      navMain: [
        {
          title: "Dashboard",
          url: "#",
          icon: <Gauge />,
          isActive: true,
          items: [
            {
              title: "Overview",
              url: "/dashboard",
            },
            {
              title: "Personal",
              url: userId ? `/dashboard/${userId}` : "/dashboard",
            },
          ],
        },
      ],
    }),
    [userId],
  );
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderRole teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
