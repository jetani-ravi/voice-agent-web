"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Agent, AssistantStatus, CreateAgentPayload } from "@/app/modules/agents/interface";
import { promptsSchema, PromptsValues } from "@/app/modules/agents/validation";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { useRouter } from "next/navigation";

interface Props {
  agent: Agent;
}

const PromptsSection = ({ agent }: Props) => {
  const { handleToast } = useToastHandler();
  const router = useRouter();
  const form = useForm<PromptsValues>({
    resolver: zodResolver(promptsSchema),
    defaultValues: {
      systemPrompt: agent.agent_prompts?.task_1?.system_prompt || "",
      agentWelcomeMessage: agent.agent_config.agent_welcome_message || "",
    },
  });

  const onSubmit = async (values: PromptsValues) => {
    try {
      const updatedPayload: CreateAgentPayload = {
        agent_config: {
          ...agent.agent_config,
          agent_welcome_message: values.agentWelcomeMessage,
        },
        agent_prompts: {
          ...agent.agent_prompts,
          task_1: {
            ...agent.agent_prompts?.task_1,
            system_prompt: values.systemPrompt,
          },
        },
      };

      // Make the update API call
      const result = await (agent.agent_id
        ? updateAgent(agent.agent_id, updatedPayload)
        : createAgent(updatedPayload));
      handleToast({ result, form });
      if (result.success && result.data?.assistant_status === AssistantStatus.SEEDING) {
        router.replace(`/agents/${result.data.agent_id}`);
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    }
  };

  return (
    <div className="w-2/5 p-6 bg-card rounded-lg overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Type in a universal prompt for your agent, such as its role,
              conversational style, objective, etc.
            </p>
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter universal prompt..."
                      className="min-h-[100px]"
                      rows={20}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    {`Use {{...}} to add variables.`}
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="agentWelcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter welcome message..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PromptsSection;
