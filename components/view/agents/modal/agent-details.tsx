"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AgentDetailDrawerProps {
  agentId: string;
}

export const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({
  agentId,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <div className="h-screen w-full sm:w-[90vw] sm:max-w-lg">
          <DrawerHeader className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleClose}>
              <ArrowLeft className="h-4 w-4 cursor-pointer" />
            </Button>
            <div className="flex-1">
              <DrawerTitle className="text-md font-semibold">
                Agent Details
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground">
                Agent ID: {agentId}
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Agent ID: {agentId}</h2>
            {/* Add more agent details here */}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
