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
import { voiceSchema, VoiceValues } from "@/app/modules/agents/validation";
import {
  Agent,
  CreateAgentPayload,
  ElevenLabsConfig,
} from "@/app/modules/agents/interface";
import { PROVIDERS } from "@/constants/providers";
import { updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Props {
  agent: Agent;
}

const VoiceSection = ({ agent }: Props) => {
  const { handleToast } = useToastHandler();
  const synthesizer = agent.agent_config.tasks[0].tools_config.synthesizer;
  const transcriber = agent.agent_config.tasks[0].tools_config.transcriber;
  const taskConfig = agent.agent_config.tasks[0].task_config;
  const provider = synthesizer?.provider_config as ElevenLabsConfig;
  const form = useForm<VoiceValues>({
    resolver: zodResolver(voiceSchema),
    defaultValues: {
      provider: synthesizer?.provider || "",
      model: provider?.model || "",
      bufferSize: synthesizer?.buffer_size || 150,
      endpointing: transcriber?.endpointing || 700,
      incrementalDelay: taskConfig?.incremental_delay || 1200,
      checkIfUserOnline: taskConfig?.check_if_user_online || false,
      checkUserOnlineMessage:
        taskConfig?.check_user_online_message || "Hey, are you still there?",
      triggerCheckUserOnlineMessageAfter:
        taskConfig?.trigger_user_online_message_after || 5,
    },
  });

  const selectedProvider = PROVIDERS.find(
    (provider) =>
      provider.key === form.watch("provider") &&
      provider.category === "synthesizer"
  );

  const onSubmit = async (data: VoiceValues) => {
    try {
      const updatedAgent: CreateAgentPayload = {
        agent_config: {
          ...agent.agent_config,
          tasks: agent.agent_config.tasks.map((task, index) => {
            if (index === 0 && task.tools_config.synthesizer) {
              return {
                ...task,
                tools_config: {
                  ...task.tools_config,
                  synthesizer: {
                    ...task.tools_config.synthesizer,
                    provider: data.provider,
                    provider_config: {
                      ...task.tools_config.synthesizer.provider_config,
                      model: data.model,
                    },
                    buffer_size: data.bufferSize,
                  },
                  transcriber: {
                    ...task.tools_config.transcriber,
                    stream: task.tools_config.transcriber?.stream || false,
                    endpointing: data.endpointing,
                  },
                },
                task_config: {
                  ...task.task_config,
                  incremental_delay: data.incrementalDelay,
                  check_if_user_online: data.checkIfUserOnline,
                  check_user_online_message: data.checkUserOnlineMessage,
                  trigger_user_online_message_after:
                    data.triggerCheckUserOnlineMessageAfter,
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
                      (provider) => provider.category === "synthesizer"
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
          name="bufferSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buffer Size</FormLabel>
              <FormDescription>
                Increasing buffer size enables agent to speak long responses
                fluently, but increases latency
              </FormDescription>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={1}
                  max={400}
                  min={1}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Endpointing Slider */}
        <FormField
          control={form.control}
          name="endpointing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpointing (ms)</FormLabel>
              <FormDescription>
                Number of milliseconds your agent will wait before generating
                response.
              </FormDescription>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={100}
                  max={5000}
                  min={0}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Incremental Delay Slider */}
        <FormField
          control={form.control}
          name="incrementalDelay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linear Delay (ms)</FormLabel>
              <FormDescription>
                Linear delay accounts for long pauses mid-sentence.
              </FormDescription>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={100}
                  max={2500}
                  min={0}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Check If User Online */}
        <FormField
          control={form.control}
          name="checkIfUserOnline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check If User is Online</FormLabel>
              <FormDescription>
                Agent will check if the user is online if there&apos;s no reply
                from the user
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

        {form.getValues("checkIfUserOnline") && (
          <>
            {/* Check User Online Message */}
            <FormField
              control={form.control}
              name="checkUserOnlineMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User is Online Message</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trigger Check User Online Message After */}
            <FormField
              control={form.control}
              name="triggerCheckUserOnlineMessageAfter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoke Message After (s)</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value!]}
                      onValueChange={(value) => field.onChange(value[0])}
                      step={1}
                      max={20}
                      min={5}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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

export default VoiceSection;
