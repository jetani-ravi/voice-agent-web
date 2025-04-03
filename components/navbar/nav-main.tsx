"use client";

import { usePathname } from "next/navigation"; // Import Next.js navigation hook
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url; // Check if the main item's URL matches the current route

          // If there are no sub-items, render a simple menu button
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title} 
                  isActive={isActive}
                  className={isActive ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r before:bg-sidebar-primary" : ""}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className={isActive ? "text-sidebar-primary" : ""} />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // If there are sub-items, check if any sub-item matches the current route
          const hasActiveSubItem = item.items.some((subItem) => pathname === subItem.url);
          const isMenuActive = isActive || hasActiveSubItem;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isMenuActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    isActive={isMenuActive}
                    className={isMenuActive ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r before:bg-sidebar-primary" : ""}
                  >
                    {item.icon && <item.icon className={isMenuActive ? "text-sidebar-primary" : ""} />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 mb-1">
                    {item.items.map((subItem) => {
                      const isSubItemActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isSubItemActive}
                            className={cn(
                              isSubItemActive ? "font-medium" : "",
                              "relative",
                              isSubItemActive ? "before:absolute before:left-[-12px] before:top-1/2 before:h-3 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-sidebar-primary" : ""
                            )}
                          >
                            <Link href={subItem.url} className="w-full">
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}