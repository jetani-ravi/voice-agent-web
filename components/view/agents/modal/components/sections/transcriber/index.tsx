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
  CreateAgentPayload,
} from "@/app/modules/agents/interface";
import { PROVIDERS } from "@/constants/providers";
import { updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Input } from "@/components/ui/input";

interface Props {
  agent: Agent;
}

const TranscriberSection = ({ agent }: Props) => {
  const { handleToast } = useToastHandler();
  const transcriber = agent.agent_config.tasks[0].tools_config.transcriber;
  const form = useForm<TranscriberValues>({
    resolver: zodResolver(transcriberSchema),
    defaultValues: {
      provider: transcriber?.provider || "",
      model: transcriber?.model || "",
      keywords: transcriber?.keywords || "",
      interruptionWait:
        agent.agent_config.tasks[0].task_config
          .number_of_words_for_interruption || 0,
    },
  });

  const selectedProvider = PROVIDERS.find(
    (provider) =>
      provider.key === form.watch("provider") &&
      provider.category === "transcriber"
  );

  const onSubmit = async (data: TranscriberValues) => {
    try {
      const updatedAgent: CreateAgentPayload = {
        agent_config: {
          ...agent.agent_config,
          tasks: agent.agent_config.tasks.map((task, index) => {
            if (index === 0 && task.tools_config.transcriber) {
              return {
                ...task,
                tools_config: {
                  ...task.tools_config,
                  transcriber: {
                    ...task.tools_config.transcriber,
                    provider: data.provider,
                    model: data.model,
                    keywords: data.keywords,
                  },
                },
                task_config: {
                  ...task.task_config,
                  number_of_words_for_interruption: data.interruptionWait,
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
                      (provider) => provider.category === "transcriber"
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
