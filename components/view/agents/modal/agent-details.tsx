"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ArrowLeft, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Agent,
  AssistantStatus,
  CreateAgentPayload,
} from "@/app/modules/agents/interface";
import PromptsSection from "./components/prompts";
import ConfigurationSection from "./components/configuration";
import TestLLMSection from "./components/test-llm";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import { Input } from "@/components/ui/input";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";

interface AgentDetailDrawerProps {
  agent: Agent;
  knowledgeBases: KnowledgeBase[];
}

export const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({
  agent,
  knowledgeBases,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [agentName, setAgentName] = useState(agent.agent_config.agent_name);
  const router = useRouter();
  const { handleToast } = useToastHandler();
  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      const updatedAgent: CreateAgentPayload = {
        agent_prompts: {
          ...agent.agent_prompts,
        },
        agent_config: {
          ...agent.agent_config,
          agent_name: agentName,
        },
      };
      const result = await (agent.agent_id
        ? updateAgent(agent.agent_id, updatedAgent)
        : createAgent(updatedAgent));
      handleToast({ result });
      if (
        result.success &&
        result.data?.assistant_status === AssistantStatus.SEEDING
      ) {
        router.replace(`/agents/${result.data.agent_id}`);
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    }
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
              <DrawerTitle className="text-md font-semibold flex items-center gap-2">
                {isEditing ? (
                  <Input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    onBlur={handleSave}
                    className="w-1/5 h-8"
                  />
                ) : (
                  <>
                    {agent.agent_config.agent_name}
                    <PencilIcon
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    />
                  </>
                )}
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
              <ConfigurationSection
                agent={agent}
                knowledgeBases={knowledgeBases}
              />

              {/* Test Section */}
              <TestLLMSection agent={agent} />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
