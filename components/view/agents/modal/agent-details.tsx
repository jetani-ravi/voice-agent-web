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
import { Agent } from "@/app/modules/agents/interface";
import PromptsSection from "./components/prompts";
import ConfigurationSection from "./components/configuration";
import TestLLMSection from "./components/test-llm";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";

interface AgentDetailDrawerProps {
  agent: Agent;
  knowledgeBases: KnowledgeBase[];
}

export const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({
  agent,
  knowledgeBases,
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
        <div className="h-screen w-full flex flex-col bg-sidebar-accent">
          <DrawerHeader className="flex items-center gap-4">
            <Button
              variant="outline"
              color="secondary"
              size="icon"
              onClick={handleClose}
            >
              <ArrowLeft className="h-4 w-4 cursor-pointer" />
            </Button>
            <div className="flex-1">
              <DrawerTitle className="text-md font-semibold">
                {agent.agent_config.agent_name}
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground">
                {agent.agent_id}
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden">
            <div className="flex h-full py-2 px-4 gap-2">
              {/* Prompts Section */}
              <PromptsSection agent={agent} />

              {/* Configuration Section */}
              <ConfigurationSection agent={agent} knowledgeBases={knowledgeBases} />

              {/* Test Section */}
              <TestLLMSection agent={agent} />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
