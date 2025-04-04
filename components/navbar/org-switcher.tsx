"use client";

import * as React from "react";
import { Briefcase, ChevronsUpDown, Edit2, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/app/modules/user/interface";
import { AggregatedOrganization } from "@/app/modules/organizations/interface";
import { setOrganization } from "@/app/modules/organizations/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { useState } from "react";
import OrganizationForm from "../view/organizations/components/organization-form";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";

export function OrganizationSwitcher({ user }: { user: User }) {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const { handleToast } = useToastHandler();
  const [activeOrganization, setActiveOrganization] = React.useState(
    user.active_organization
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<AggregatedOrganization | null>(null);

  const onOrganizationChange = async (organization: AggregatedOrganization) => {
    if (organization._id === activeOrganization._id) return;
    try {
      const result = await setOrganization(organization._id);
      if (result.success) {
        setActiveOrganization(organization);
      }
      handleToast({ result });
    } catch (error) {
      console.error("Error while setting active organization: ", error);
    }
  };

  const onEditOrganization = (organization: AggregatedOrganization) => {
    setSelectedOrganization(organization);
    setIsModalOpen(true);
  };

  const toggleOrganizationModal = () => {
    setSelectedOrganization(null);
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {activeOrganization.name}
                  </span>
                  {activeOrganization?.email && (
                    <span className="truncate text-xs">
                      {activeOrganization?.email}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {user?.organizations.map((organization) => (
                <DropdownMenuItem
                  key={organization.name}
                  onClick={() => onOrganizationChange(organization)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Briefcase className="h-4 w-4 text-info" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {organization.name}
                    </span>
                    {organization._id === activeOrganization?._id && (
                      <Badge
                        className="w-fit px-1 py-[1px] text-[10px]"
                        variant="secondary"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuShortcut>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onEditOrganization(organization);
                      }}
                      disabled={session?.user.id !== organization.created_by}
                    >
                      <Edit2 className="h-3 w-3 text-info" />
                    </Button>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={toggleOrganizationModal}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add Organization
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <OrganizationForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        organization={selectedOrganization}
        setActiveOrganization={setActiveOrganization}
      />
    </>
  );
}