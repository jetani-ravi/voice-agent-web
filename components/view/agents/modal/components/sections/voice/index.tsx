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
  AssistantStatus,
  CreateAgentPayload,
} from "@/app/modules/agents/interface";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ActiveOrganizationDetails } from "@/app/modules/organizations/interface";
import { getProviderConfig, getModel, getSynthProviderConfig } from "@/lib/voice";
import { RESPONSE_RATES } from "@/constants/agent";

interface Props {
  agent: Agent;
  organization: ActiveOrganizationDetails;
}

const VoiceSection = ({ agent, organization }: Props) => {
  const { handleToast } = useToastHandler();
  const router = useRouter();
  const task = agent.agent_config.tasks.find(
    (task) => task.task_type === "conversation"
  );
  const synthesizer = task?.tools_config.synthesizer;
  const transcriber = task?.tools_config.transcriber;
  const taskConfig = task?.task_config;
  const providerConfig = getProviderConfig(synthesizer);

  const getResponseRate = (incrementalDelay?: number, endpointing?: number) => {
    if (!incrementalDelay || !endpointing) return "NORMAL";

    // Check for exact matches
    for (const [key, value] of Object.entries(RESPONSE_RATES)) {
      if ('incrementalDelay' in value && 
          value.incrementalDelay === incrementalDelay && 
          value.endpointing === endpointing) {
        return key;
      }
    }

    // If values don't match any preset, it's custom
    return "CUSTOM";
  };

  const form = useForm<VoiceValues>({
    resolver: zodResolver(voiceSchema),
    defaultValues: {
      responseRate: getResponseRate(taskConfig?.incremental_delay, transcriber?.endpointing),
      provider: synthesizer?.provider || "",
      model: getModel(providerConfig),
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

  // Get unique providers from organization voices
  const providers = Array.from(
    new Set(organization?.voices?.map((voice) => voice.provider))
  );

  // Get models based on selected provider
  const selectedProvider = form.watch("provider");
  const models = organization?.voices?.filter(
    (voice) => voice.provider === selectedProvider
  );

  // Watch responseRate to conditionally render sliders
  const selectedRate = form.watch("responseRate");

  // Update values when response rate changes
  const handleResponseRateChange = (value: string) => {
    form.setValue("responseRate", value);
    if (value !== "CUSTOM" && value in RESPONSE_RATES) {
      const rate = RESPONSE_RATES[value as keyof typeof RESPONSE_RATES];
      if ('incrementalDelay' in rate) {
        form.setValue("incrementalDelay", rate.incrementalDelay);
        form.setValue("endpointing", rate.endpointing);
      }
    }
  };

  const onSubmit = async (data: VoiceValues) => {
    // Find the selected voice from models array
    const selectedVoice = models.find((voice) => voice.voice_id === data.model);
    
    if (!selectedVoice) {
      console.error("Selected voice not found");
      return;
    }

    const synthProviderConfig = getSynthProviderConfig(data, selectedVoice);

    if (!synthProviderConfig) {
      console.error("Invalid provider config");
      return;
    }

    try {
      const updatedAgent: CreateAgentPayload = {
        agent_prompts: {
          ...agent.agent_prompts,
        },
        agent_config: {
          ...agent.agent_config,
          tasks: agent.agent_config.tasks.map((task) => {
            if (task.task_type === "conversation" && task.tools_config.synthesizer) {
              return {
                ...task,
                tools_config: {
                  ...task.tools_config,
                  synthesizer: {
                    ...task.tools_config.synthesizer,
                    provider: data.provider,
                    provider_config: synthProviderConfig,
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
                  trigger_user_online_message_after: data.triggerCheckUserOnlineMessageAfter,
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
                    {providers?.map((provider) => (
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models?.length > 0 ? (
                      models?.map((model) => (
                        <SelectItem key={model.voice_id} value={model.voice_id}>
                          {model.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="">No models available</SelectItem>
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

        {/* Response Rate Select */}
        <FormField
          control={form.control}
          name="responseRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Rate</FormLabel>
              <FormControl>
                <Select
                  onValueChange={handleResponseRateChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Response Rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RESPONSE_RATES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                {RESPONSE_RATES[field.value as keyof typeof RESPONSE_RATES]?.description}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show endpointing and incremental delay sliders only for Custom rate */}
        {selectedRate === "CUSTOM" && (
          <>
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
          </>
        )}

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
                    <Input {...field} placeholder="Hey, are you still there?" />
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
