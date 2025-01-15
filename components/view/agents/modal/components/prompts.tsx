import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Agent } from "@/app/modules/agents/interface";

interface Props {
  agent: Agent;
}

const PromptsSection = ({ agent }: Props) => {
  return (
    <div className="w-1/2 p-6 bg-card rounded-lg">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Type in a universal prompt for your agent, such as its role,
            conversational style, objective, etc.
          </p>
          <Textarea
            placeholder="Enter universal prompt..."
            className="min-h-[100px]"
            value={agent.agent_prompts?.task_1?.system_prompt || ""}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Welcome Message</h3>
          <Input placeholder="Enter welcome message..." />
        </div>

        <Button variant="outline" className="w-full">
          Edit prompt tree
        </Button>
      </div>
    </div>
  );
};

export default PromptsSection;
