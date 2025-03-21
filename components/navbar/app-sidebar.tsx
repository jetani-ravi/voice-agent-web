"use client";

import * as React from "react";
import {
  AudioLines,
  BookOpen,
  Bot,
  KeyRound,
  Package,
  Phone,
  Settings2,
  History,
} from "lucide-react";

import { NavMain } from "@/components/navbar/nav-main";
import { NavUser } from "@/components/navbar/nav-user";
import { OrganizationSwitcher } from "@/components/navbar/org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "@/app/modules/user/interface";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Agents",
      url: "/agents",
      icon: Bot,
    },
    {
      title: "Call History",
      url: "/call-history",
      icon: History,
    },
    {
      title: "Knowledge Base",
      url: "/knowledge-base",
      icon: BookOpen,
    },
    {
      title: "Phone Numbers",
      url: "/phone-numbers",
      icon: Phone,
      isActive: true,
    },
    {
      title: "Voice Library",
      url: "/voice-library",
      icon: AudioLines,
    },
    {
      title: "Providers",
      url: "/providers",
      icon: Package,
    },
    {
      title: "API Keys",
      url: "/api-keys",
      icon: KeyRound,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher user={props.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
