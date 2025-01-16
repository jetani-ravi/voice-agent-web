import { Save, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import { llmSchema, LLMValues } from "@/app/modules/agents/validation";
import {
  Agent,
  CreateAgentPayload,
  GraphAgentConfig,
  LlmAgent,
} from "@/app/modules/agents/interface";
import { PROVIDERS } from "@/constants/providers";
import { useRouter } from "next/navigation";
import { updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import FaqsModal from "./faqs-modal";

interface Props {
  agent: Agent;
  knowledgeBases: KnowledgeBase[];
}

const LLMSection = ({ agent, knowledgeBases }: Props) => {
  const { handleToast } = useToastHandler();
  const router = useRouter();
  const llmAgent = agent.agent_config.tasks[0].tools_config
    .llm_agent as LlmAgent<"graph_agent">;
  const llmConfig: GraphAgentConfig = llmAgent?.llm_config;
  const providerConfig =
    llmConfig?.nodes[0].rag_config?.provider_config || ({} as any);
  const form = useForm<LLMValues>({
    resolver: zodResolver(llmSchema),
    defaultValues: {
      provider: llmConfig?.provider || "",
      model: llmConfig?.model || "",
      tokens: llmConfig?.max_tokens || 150,
      temperature: llmConfig?.temperature || 0.2,
      knowledgeBase: providerConfig?.vector_id || "",
    },
  });

  const selectedProvider = PROVIDERS.find(
    (provider) =>
      provider.key === form.watch("provider") &&
      provider.category === "llm"
  );

  const onSubmit = async (data: LLMValues) => {
    try {
      const updatedAgent: CreateAgentPayload = {
        agent_config: {
          ...agent.agent_config,
          tasks: agent.agent_config.tasks.map((task, index) => {
            if (index === 0 && task.tools_config.llm_agent) {
              const llmAgent = task.tools_config
                .llm_agent as LlmAgent<"graph_agent">;
              const llmConfig: GraphAgentConfig = llmAgent?.llm_config;
              const providerConfig =
                llmConfig?.nodes[0].rag_config?.provider_config || ({} as any);

              return {
                ...task,
                tools_config: {
                  ...task.tools_config,
                  llm_agent: {
                    ...task.tools_config.llm_agent,
                    llm_config: {
                      ...llmConfig,
                      provider: data.provider,
                      model: data.model,
                      max_tokens: data.tokens,
                      temperature: data.temperature,
                      nodes: [
                        {
                          ...llmConfig.nodes[0],
                          rag_config: {
                            ...llmConfig.nodes[0].rag_config,
                            provider_config: {
                              ...providerConfig,
                              vector_id: data.knowledgeBase,
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              };
            }
            return task;
          }),
        },
      };
      const result = await updateAgent(agent.agent_id, updatedAgent);
      handleToast({ result, form });
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-[1px]"
      >
        {/* Provider Select */}
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.filter(
                      (provider) => provider.category === "llm"
                    ).map((provider) => (
                      <SelectItem key={provider.key} value={provider.key}>
                        {provider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model Select */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProvider?.models?.map((model) => (
                      <SelectItem key={model.key} value={model.key}>
                        {model.label}
                      </SelectItem>
                    )) || <SelectItem value="">No models available</SelectItem>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Token Slider */}
        <FormField
          control={form.control}
          name="tokens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token generated on each LLM output</FormLabel>
              <p className="text-xs text-muted-foreground">
                Increasing tokens enables longer responses but increases latency
              </p>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={10}
                  max={4096}
                  min={1}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Temperature Slider */}
        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature</FormLabel>
              <p className="text-xs text-muted-foreground">
                Increasing temperature enables heightened creativity but
                increases deviation
              </p>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={0.01}
                  max={1}
                  min={0.01}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Knowledge Base Select */}
        <FormField
          control={form.control}
          name="knowledgeBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Knowledge Base</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Knowledge Base" />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeBases?.map((knowledgeBase) => (
                      <SelectItem
                        key={knowledgeBase.vector_id}
                        value={knowledgeBase.vector_id}
                      >
                        {knowledgeBase.fileName}
                      </SelectItem>
                    ))}
                    <SelectItem
                      value="add-new"
                      onClick={() => {
                        router.push(`/knowledge-base`);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        Add new Knowledge Base
                        <SquareArrowOutUpRight className="h-3 w-3" />
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FAQs and Guardrails */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Add FAQs and Guardrails</h3>
          <FaqsModal />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LLMSection;
