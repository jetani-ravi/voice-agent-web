import { Save } from "lucide-react";
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
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transcriberSchema,
  TranscriberValues,
} from "@/app/modules/agents/validation";
import {
  Agent,
  AssistantStatus,
  CreateAgentPayload,
} from "@/app/modules/agents/interface";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TranscribersConfig } from "@/app/modules/models-config/interface";
import { getTranscribers } from "@/app/modules/models-config/action";
import { LANGUAGES } from "@/constants/providers";
import { Switch } from "@/components/ui/switch";
import { SystemProviders } from "@/app/modules/providers/interface";

interface Props {
  agent: Agent;
  systemProviders: SystemProviders[];
  onModelChange?: (provider: string, model: string) => void;
}

const TranscriberSection = ({ agent, onModelChange }: Props) => {
  const { handleToast } = useToastHandler();
  const [transcribers, setTranscribers] = useState<TranscribersConfig[]>([]);
  const router = useRouter();
  const task = agent.agent_config.tasks.find(
    (task) => task.task_type === "conversation"
  );
  const transcriber = task?.tools_config.transcriber;
  const form = useForm<TranscriberValues>({
    resolver: zodResolver(transcriberSchema),
    defaultValues: {
      provider: transcriber?.provider || "",
      model: transcriber?.model || "",
      language: transcriber?.language || "",
      keywords: transcriber?.keywords || "",
      interruptionWait: task?.task_config.number_of_words_for_interruption || 0,
      generatePreciseTranscript:
        task?.task_config.generate_precise_transcript || false,
    },
  });

  const fetchTranscribers = async () => {
    try {
      const result = await getTranscribers();
      if (result.success) {
        setTranscribers(result.data!);
      }
    } catch (error) {
      console.error("Error fetching transcribers: ", error);
    }
  };

  useEffect(() => {
    fetchTranscribers();
  }, []);

  const providers = Array.from(
    new Set(transcribers.map((transcriber) => transcriber.provider))
  );

  const selectedProvider = form.watch("provider");
  const selectedModel = form.watch("model");

  const models = transcribers.filter(
    (transcriber) => transcriber.provider === selectedProvider
  );

  // Get supported languages for the selected model
  const selectedModelConfig = transcribers.find(
    (transcriber) => transcriber.canonical_name === selectedModel
  );

  // Filter LANGUAGES based on the selected model's supported languages
  const availableLanguages = LANGUAGES.filter(
    (language) =>
      language.key !== "all" &&
      (!selectedModelConfig?.languages || // If no model is selected or model has no language restrictions, show all
        selectedModelConfig.languages.includes(language.value))
  );

  const onSubmit = async (data: TranscriberValues) => {
    try {
      const updatedAgent: CreateAgentPayload = {
        agent_prompts: {
          ...agent.agent_prompts,
        },
        agent_config: {
          ...agent.agent_config,
          tasks: agent.agent_config.tasks.map((task) => {
            if (
              task.task_type === "conversation" &&
              task.tools_config.transcriber
            ) {
              return {
                ...task,
                tools_config: {
                  ...task.tools_config,
                  transcriber: {
                    ...task.tools_config.transcriber,
                    provider: data.provider,
                    model: data.model,
                    language: data.language,
                    keywords: data.keywords,
                  },
                },
                task_config: {
                  ...task.task_config,
                  number_of_words_for_interruption: data.interruptionWait,
                  generate_precise_transcript: data.generatePreciseTranscript,
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
                    form.setValue("model", models?.[0]?.canonical_name || ""); // Reset model field
                    form.setValue("language", ""); // Reset language field
                    if (onModelChange) {
                      onModelChange(value, models?.[0]?.architecture || "");
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
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
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (onModelChange) {
                      onModelChange(selectedProvider, value);
                    }
                    form.setValue("language", ""); // Reset language field when model changes
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models?.map((model) => (
                      <SelectItem
                        key={model.canonical_name}
                        value={model.canonical_name}
                      >
                        {model.canonical_name}
                      </SelectItem>
                    )) || <SelectItem value="">No models available</SelectItem>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.length > 0 ? (
                      availableLanguages.map((language) => (
                        <SelectItem key={language.key} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="">No Languages available</SelectItem>
                    )}
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
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input placeholder="Bruce:100" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Enter certain keywords/proper nouns you&apos;d want to boost
                while understanding speech
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Generate Precise Transcript */}
        <FormField
          control={form.control}
          name="generatePreciseTranscript"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Generate Precise Transcript</FormLabel>
              <FormDescription>
                Agent will try to generate more precise transcripts during
                interruptions
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Temperature Slider */}
        <FormField
          control={form.control}
          name="interruptionWait"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Number of words to wait for before interrupting
              </FormLabel>
              <p className="text-xs text-muted-foreground">
                Agent will not consider interruptions until these many words are
                spoken (If recipient says “Stopwords” such as Stop, Wait, Hold
                On, agent will pause by default)
              </p>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={1}
                  max={10}
                  min={1}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default TranscriberSection;
