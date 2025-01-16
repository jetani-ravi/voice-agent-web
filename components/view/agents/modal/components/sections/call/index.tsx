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
import { CallValues, callSchema } from "@/app/modules/agents/validation";
import { Agent, CreateAgentPayload } from "@/app/modules/agents/interface";
import { PROVIDERS } from "@/constants/providers";
import { updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Props {
  agent: Agent;
}

const CallSection = ({ agent }: Props) => {
  const { handleToast } = useToastHandler();
  const telephony = agent.agent_config.tasks[0].tools_config.input;
  const taskConfig = agent.agent_config.tasks[0].task_config;
  const form = useForm<CallValues>({
    resolver: zodResolver(callSchema),
    defaultValues: {
      provider: telephony?.provider || "",
      detectVoicemail: taskConfig?.voicemail || false,
      hangupAfterSilence: taskConfig?.hangup_after_silence || 10,
      callCancellationPrompt: taskConfig?.call_cancellation_prompt || "",
      callHangupMessage: taskConfig?.call_hangup_message || "",
      callTerminate: taskConfig?.call_terminate || 300,
    },
  });

  const onSubmit = async (data: CallValues) => {
    try {
      const updatedAgent: CreateAgentPayload = {
        agent_config: {
          ...agent.agent_config,
          tasks: agent.agent_config.tasks.map((task, index) => {
            if (index === 0 && task.tools_config.input) {
              return {
                ...task,
                tools_config: {
                  ...task.tools_config,
                  input: {
                    ...task.tools_config.input,
                    provider: data.provider,
                  },
                  output: {
                    ...task.tools_config.output,
                    provider: data.provider,
                  },
                  task_config: {
                    ...task.task_config,
                    voicemail: data.detectVoicemail,
                    hangup_after_silence: data.hangupAfterSilence,
                    call_cancellation_prompt: data.callCancellationPrompt,
                    call_hangup_message: data.callHangupMessage,
                    call_terminate: data.callTerminate,
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
                      (provider) => provider.category === "telephony"
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

        {/* Voicemail Detection */}
        <FormField
          control={form.control}
          name="detectVoicemail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voicemail Detection</FormLabel>
              <FormDescription>
                Automatically disconnect call on voicemail detection
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

        {/* Hangup After Silence Slider */}
        <FormField
          control={form.control}
          name="hangupAfterSilence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hangup After Silence (s)</FormLabel>
              <FormDescription>
                Number of seconds your agent will wait before hanging up the
                call.
              </FormDescription>
              <FormControl>
                <Slider
                  value={[field.value!]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={1}
                  max={30}
                  min={1}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Call Cancellation Prompt */}
        <FormField
          control={form.control}
          name="callCancellationPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call Hangup Prompt</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Call Hangup Message */}
        <FormField
          control={form.control}
          name="callHangupMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call Hangup Message</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Call Terminate Slider */}
        <FormField
          control={form.control}
          name="callTerminate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call Terminate (s)</FormLabel>
              <FormControl>
                <Slider
                  value={[field.value!]}
                  onValueChange={(value) => field.onChange(value[0])}
                  step={5}
                  max={1200}
                  min={30}
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

export default CallSection;
