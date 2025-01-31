import {
  Pencil,
  PlusCircle,
  Save,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import {
  FaqsValues,
  llmSchema,
  LLMValues,
} from "@/app/modules/agents/validation";
import {
  Agent,
  AssistantStatus,
  CreateAgentPayload,
  GraphAgentConfig,
  LlmAgent,
} from "@/app/modules/agents/interface";
import { PROVIDERS } from "@/constants/providers";
import { useRouter } from "next/navigation";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import FaqsModal from "./faqs-modal";
import { GRAPH_NODE, VECTOR_DB } from "@/constants/agent";

interface Props {
  agent: Agent;
  knowledgeBases: KnowledgeBase[];
}

const LLMSection = ({ agent, knowledgeBases }: Props) => {
  const { handleToast } = useToastHandler();
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqsValues[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<{
    data: FaqsValues;
    index: number;
  } | null>(null);
  const task = agent.agent_config.tasks.find(
    (task) => task.task_type === "conversation"
  );
  const llmAgent = task?.tools_config.llm_agent as LlmAgent<"graph_agent">;
  const llmConfig: GraphAgentConfig = llmAgent?.llm_config;
  const providerConfig =
    llmConfig?.nodes?.[0]?.rag_config?.provider_config || ({} as any);
  const form = useForm<LLMValues>({
    resolver: zodResolver(llmSchema),
    defaultValues: {
      provider: llmConfig?.provider || "",
      model: llmConfig?.model || "",
      tokens: llmConfig?.max_tokens || 150,
      temperature: llmConfig?.temperature || 0.2,
      knowledgeBase: providerConfig?.vector_id || "none",
    },
  });

  useEffect(() => {
    if (agent) {
      const task = agent.agent_config.tasks.find(
        (task) => task.task_type === "conversation"
      );
      setFaqs(
        task?.tools_config.llm_agent?.routes?.routes?.map((route) => ({
          ...route,
          score_threshold: route.score_threshold || 0.9,
          utterances: route.utterances.map((utterance) => ({
            utterance: utterance,
          })),
        })) || []
      );
    }
  }, [agent]);

  const handleEditFaq = (index: number) => {
    setSelectedFaq({ data: faqs[index], index });
    setIsOpen(true);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveFaq = (data: FaqsValues) => {
    if (selectedFaq !== null) {
      // Update existing FAQ
      setFaqs((prev) =>
        prev.map((faq, index) => (index === selectedFaq.index ? data : faq))
      );
      setSelectedFaq(null);
    } else {
      // Add new FAQ
      setFaqs((prev) => [...prev, data]);
    }
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedFaq(null);
  };

  const selectedProvider = PROVIDERS.find(
    (provider) =>
      provider.key === form.watch("provider") && provider.category === "llm"
  );

  const onSubmit = async (data: LLMValues) => {
    try {
      const selectedModel = selectedProvider?.models?.find(
        (model) => model.key === data.model
      );
      const updatedAgent: CreateAgentPayload = {
        agent_prompts: {
          ...agent.agent_prompts,
        },
        agent_config: {
          ...agent.agent_config,
          tasks: agent.agent_config.tasks.map((task) => {
            if (
              task.task_type === "conversation" &&
              task.tools_config.llm_agent
            ) {
              const llmAgent = task.tools_config
                .llm_agent as LlmAgent<"graph_agent">;
              const llmConfig: GraphAgentConfig = llmAgent?.llm_config;
              const providerConfig =
                llmConfig?.nodes?.[0]?.rag_config?.provider_config ||
                ({} as any);

              return {
                ...task,
                tools_config: {
                  ...task.tools_config,
                  llm_agent: {
                    ...task.tools_config.llm_agent,
                    agent_type:
                      data?.knowledgeBase === "none"
                        ? "simple_llm_agent"
                        : "graph_agent",
                    routes:
                      faqs.length > 0
                        ? {
                            ...llmConfig.routes,
                            embedding_model:
                              "snowflake/snowflake-arctic-embed-m",
                            routes: faqs.map((faq) => ({
                              ...faq,
                              utterances: faq.utterances.map(
                                (utterance) => utterance.utterance
                              ),
                            })),
                          }
                        : undefined,
                    llm_config: {
                      ...llmConfig,
                      provider: data.provider,
                      model: data.model,
                      family: selectedModel?.family || "",
                      max_tokens: data.tokens,
                      temperature: data.temperature,
                      nodes:
                        data?.knowledgeBase === "none"
                          ? undefined
                          : [
                              {
                                ...GRAPH_NODE,
                                rag_config: {
                                  temperature: data.temperature,
                                  model: data.model,
                                  provider: VECTOR_DB.QDRANT,
                                  max_tokens: data.tokens,
                                  provider_config: {
                                    ...providerConfig,
                                    vector_id: data.knowledgeBase,
                                    similarity_top_k: 10,
                                  },
                                },
                                prompt:
                                  agent?.agent_prompts?.task_1?.system_prompt,
                              },
                            ],
                      agent_information:
                        data?.knowledgeBase === "none"
                          ? "simple_llm_agent"
                          : "graph_agent",
                      current_node_id:
                        data?.knowledgeBase === "none" ? "" : "root",
                    },
                  },
                },
              };
            }
            return task;
          }),
        },
      };

      const result = await (agent.agent_id
        ? updateAgent(agent.agent_id, updatedAgent)
        : createAgent(updatedAgent));
      handleToast({ result, form });
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
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("model", ""); // Reset model field
                  }}
                  value={field.value}
                >
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
                <Select
                  onValueChange={(value) => {
                    if (value === "add-new") {
                      window.open(`/knowledge-base`, "_blank");
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Knowledge Base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Knowledge Base</SelectItem>
                    {knowledgeBases?.map((knowledgeBase) => (
                      <SelectItem
                        key={knowledgeBase.vector_id}
                        value={knowledgeBase.vector_id}
                      >
                        {knowledgeBase.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="add-new">
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
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">FAQs and Guardrails</h3>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(true)}
              className="h-8"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add New
            </Button>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-muted p-3 rounded-md hover:bg-muted/80 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <h5 className="font-medium">{faq.route_name}</h5>
                  <p className="text-sm text-muted-foreground">
                    {faq.utterances.length} utterance
                    {faq.utterances.length !== 1 ? "s" : ""} • Threshold:{" "}
                    {faq.score_threshold}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    onClick={() => handleEditFaq(index)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    onClick={() => handleDeleteFaq(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <FaqsModal
            isOpen={isOpen}
            onClose={handleCloseModal}
            onSaveFaq={handleSaveFaq}
            initialData={selectedFaq?.data}
          />
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
