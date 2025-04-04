"use client";

import React, { useState, useEffect } from "react";
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
  LlmAgent,
} from "@/app/modules/agents/interface";
import PromptsSection from "./components/prompts";
import ConfigurationSection from "./components/configuration";
import TestLLMSection from "./components/test-llm";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import { Input } from "@/components/ui/input";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { ActiveOrganizationDetails } from "@/app/modules/organizations/interface";
import { ProvidersWithConnection } from "@/app/modules/providers/interface";
import CostDisplay from "./components/cost-display";
import { calculateCostPerMinute } from "@/lib/cost-calculator";
import { getSynthModelForCostCalculation } from "@/lib/voice";

interface AgentDetailDrawerProps {
  agent: Agent;
  knowledgeBases: KnowledgeBase[];
  organization: ActiveOrganizationDetails;
  systemProviders: ProvidersWithConnection[];
}

export const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({
  agent,
  knowledgeBases,
  organization,
  systemProviders,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [agentName, setAgentName] = useState(agent.agent_config.agent_name);
  const [selectedModels, setSelectedModels] = useState({
    llm: {
      provider: "",
      model: "",
    },
    transcriber: {
      provider: "",
      model: "",
    },
    synthesizer: {
      provider: "",
      model: "",
    },
  });
  const router = useRouter();
  const { handleToast } = useToastHandler();

  // Get the task and tools configuration
  const task = agent.agent_config.tasks.find(
    (task) => task.task_type === "conversation"
  );
  const llmAgent = task?.tools_config.llm_agent as LlmAgent<"simple_llm_agent">;
  const transcriber = task?.tools_config.transcriber;
  const synthesizer = task?.tools_config.synthesizer;

  // Initialize selected models from agent configuration
  useEffect(() => {
    setSelectedModels({
      llm: {
        provider: llmAgent?.llm_config?.provider || "",
        model: llmAgent?.llm_config?.model || "",
      },
      transcriber: {
        provider: transcriber?.provider || "",
        model: transcriber?.model || "",
      },
      synthesizer: {
        provider: synthesizer?.provider || "",
        model:
          getSynthModelForCostCalculation(synthesizer?.provider_config) || "",
      },
    });
  }, [agent, llmAgent, transcriber, synthesizer]);

  // Calculate cost based on selected models
  const costBreakdown = calculateCostPerMinute(
    selectedModels.llm,
    selectedModels.transcriber,
    selectedModels.synthesizer,
    systemProviders
  );

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

  // Update selected models when they change
  const updateSelectedModel = (
    type: "llm" | "transcriber" | "synthesizer",
    model: { provider: string; model: string }
  ) => {
    setSelectedModels((prev) => ({
      ...prev,
      [type]: model,
    }));
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <div className="h-screen w-full flex flex-col bg-sidebar-accent">
          <DrawerHeader className="flex flex-col flex-wrap gap-4 pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
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
                        className="w-full h-8"
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
              </div>
              <CostDisplay 
                costBreakdown={costBreakdown} 
                selectedModels={selectedModels}
                className="w-full sm:w-96"
              />
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full py-2 px-4 gap-4">
              {/* Prompts Section */}
              <PromptsSection 
                agent={agent} 
                className="w-full lg:w-2/5 h-[80vh] lg:h-auto overflow-auto" 
              />

              {/* Configuration Section */}
              <ConfigurationSection
                agent={agent}
                knowledgeBases={knowledgeBases}
                organization={organization}
                systemProviders={systemProviders}
                onModelChange={updateSelectedModel}
                className="w-full lg:flex-1 h-[80vh] lg:h-auto overflow-auto"
              />

              {/* Test Section */}
              <TestLLMSection 
                agent={agent} 
                className="w-full lg:flex-1 h-[80vh] lg:h-auto overflow-auto" 
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
