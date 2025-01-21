import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  postCallAnalyticsSchema,
  PostCallAnalyticsValues,
} from "@/app/modules/agents/validation";
import {
  Agent,
  AssistantStatus,
  CreateAgentPayload,
  LlmAgent,
  Task,
} from "@/app/modules/agents/interface";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

interface Props {
  agent: Agent;
}

const PostCallAnalytics = ({ agent }: Props) => {
  const { handleToast } = useToastHandler();
  const router = useRouter();
  const summarizationTask = agent.agent_config.tasks?.find(
    (task) => task.task_type === "summarization"
  );
  const extractionTask = agent.agent_config.tasks?.find(
    (task) => task.task_type === "extraction"
  );
  const extractionLLMAgent = extractionTask?.tools_config
    .llm_agent as LlmAgent<"simple_llm_agent">;
  const form = useForm<PostCallAnalyticsValues>({
    resolver: zodResolver(postCallAnalyticsSchema),
    defaultValues: {
      webhookUrl: agent.webhook_url || "",
      summarizeCall: summarizationTask ? true : false,
      extractCallSummary: extractionTask ? true : false,
      extractCallSummaryPrompt:
        extractionLLMAgent?.llm_config.extraction_details || "",
    },
  });

  const onSubmit = async (data: PostCallAnalyticsValues) => {
    try {
      // Map existing tasks and update if necessary
      const updatedTasks = agent.agent_config.tasks
        .filter((task) => {
          if (task.task_type === "summarization" && !data.summarizeCall) {
            return false; // Remove summarization task if toggle is off
          }
          if (task.task_type === "extraction" && !data.extractCallSummary) {
            return false; // Remove extraction task if toggle is off
          }
          return true; // Keep all other tasks
        })
        .map((task) => {
          if (task.task_type === "extraction" && data.extractCallSummary) {
            // Update extraction task if toggle is on
            return {
              ...task,
              tools_config: {
                ...task.tools_config,
                llm_agent: {
                  ...task.tools_config.llm_agent,
                  extraction_details: data.extractCallSummaryPrompt,
                },
              },
            };
          }
          return task; // Preserve other tasks as is
        });

      // Add new tasks if toggles are on and tasks don't exist
      if (data.summarizeCall && !summarizationTask) {
        updatedTasks.push({
          task_type: "summarization",
        } as Task); // Dynamically cast as Task
      }
      if (data.extractCallSummary && !extractionTask) {
        updatedTasks.push({
          task_type: "extraction",
          tools_config: {
            llm_agent: {
              extraction_details: data.extractCallSummaryPrompt || "",
            },
          },
        } as Task); // Dynamically cast as Task
      }

      // Prepare the updated agent payload
      const updatedAgent: CreateAgentPayload = {
        agent_prompts: {
          ...agent.agent_prompts,
        },
        agent_config: {
          ...agent.agent_config,
          tasks: updatedTasks,
        },
        webhook_url: data.webhookUrl,
      };

      console.log("updatedAgent", updatedAgent);

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
        {/* Summarize Call */}
        <FormField
          control={form.control}
          name="summarizeCall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summarization</FormLabel>
              <FormDescription>
                Generate a summary of the conversation automatically
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

        {/* Extract Call Summary */}
        <FormField
          control={form.control}
          name="extractCallSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extraction</FormLabel>
              <FormDescription>
                Extract structured information from the conversation according
                to a custom prompt provided
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

        {form.getValues("extractCallSummary") && (
          <>
            {/* Check User Online Message */}
            <FormField
              control={form.control}
              name="extractCallSummaryPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Push all exection data to webhook */}
        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook URL</FormLabel>
              <FormDescription>
                Automatically receive all execution data for this agent using
                webhook
              </FormDescription>
              <FormControl>
                <Input {...field} />
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

export default PostCallAnalytics;
