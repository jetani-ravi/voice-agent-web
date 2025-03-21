import {
  CalendarCheck,
  CalendarSearch,
  Pencil,
  PhoneForwarded,
  Plus,
  Save,
  SquareFunction,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Agent,
  APIParams,
  AssistantStatus,
  CreateAgentPayload,
  ToolFunction,
  ToolModel,
} from "@/app/modules/agents/interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CalendarAvailabilityDialog from "./modals/calendar-availability";
import BookCalendarDialog from "./modals/book-calendar";
import TransferCallDialog from "./modals/transfer-call";
import CustomFunctionDialog from "./modals/custom-functions";
import { createAgent, updateAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { useRouter } from "next/navigation";

interface Props {
  agent: Agent;
}

const FunctionsSection = ({ agent }: Props) => {
  const { handleToast } = useToastHandler();
  const router = useRouter();
  const [apiToolsConfig, setApiToolsConfig] = useState<ToolModel>({
    tools: [],
    tools_params: {},
  });
  const [editState, setEditState] = useState<{
    isEditing: boolean;
    toolName: string;
    defaultValues: any;
  } | null>(null);

  useEffect(() => {
    if (agent) {
      const task = agent.agent_config.tasks.find(
        (task) => task.task_type === "conversation"
      );
      setApiToolsConfig({
        tools: task?.tools_config?.api_tools?.tools,
        tools_params: task?.tools_config?.api_tools?.tools_params || {},
      });
    }
  }, [agent]);

  const [dialogs, setDialogs] = useState({
    calendarAvailability: false,
    bookCalendar: false,
    transferCall: false,
    customFunction: false,
  });

  const toggleDialog = (dialog: keyof typeof dialogs) => {
    setEditState(null);
    setDialogs((prev) => ({
      ...prev,
      [dialog]: !prev[dialog],
    }));
  };

  const updateApiTools = (tool: ToolFunction, toolParams: APIParams) => {
    setApiToolsConfig((prev) => {
      const updatedTools = editState?.isEditing
        ? prev.tools!.map((t) => (t.function.name === editState.toolName ? tool : t))
        : [...(prev.tools?.filter((t) => t.function.name !== tool.function.name) || []), tool];

      return {
        tools: updatedTools,
        tools_params: {
          ...prev.tools_params,
          [tool.function.name]: toolParams,
        },
      };
    });

    // Reset edit state
    setEditState(null);
  };

  const handleDeleteTool = (toolName: string) => {
    setApiToolsConfig((prev) => {
      const updatedTools = prev.tools!.filter((t) => t.function.name !== toolName);

      // Remove the tool from tools_params
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [toolName]: _, ...updatedToolParams } = prev.tools_params;

      return {
        tools: updatedTools,
        tools_params: updatedToolParams,
      };
    });
  };

  const handleEditTool = (toolName: string) => {
    const tool = apiToolsConfig.tools?.find((t) => t.function.name === toolName);
    const toolParams = apiToolsConfig.tools_params[toolName];

    if (tool?.function.key === "check_availability_of_slots") {
      try {
        const params = JSON.parse(toolParams.param || "");
        setDialogs((prev) => ({
          ...prev,
          calendarAvailability: true,
        }));

        // Store edit state
        setEditState({
          isEditing: true,
          toolName,
          defaultValues: {
            description: tool.function.description,
            apiKey: toolParams.api_token,
            eventType: params.eventTypeId,
            timezone: params.timeZone,
          },
        });
      } catch (error) {
        console.error("Error parsing tool params:", error);
      }
    } else if (tool?.function.key === "book_appointment") {
      try {
        const params = JSON.parse(toolParams.param || "");
        setDialogs((prev) => ({
          ...prev,
          bookCalendar: true,
        }));

        // Store edit state
        setEditState({
          isEditing: true,
          toolName,
          defaultValues: {
            description: tool.function.description,
            apiKey: toolParams.api_token,
            eventType: params.eventTypeId,
            timezone: params.timeZone,
          },
        });
      } catch (error) {
        console.error("Error parsing tool params:", error);
      }
    } else if (tool?.function.key === "transfer_call") {
      try {
        const params = JSON.parse(toolParams.param || "");
        setDialogs((prev) => ({
          ...prev,
          transferCall: true,
        }));

        // Store edit state
        setEditState({
          isEditing: true,
          toolName,
          defaultValues: {
            description: tool?.function.description,
            callTransferNumber: params.call_transfer_number,
          },
        });
      } catch (error) {
        console.error("Error parsing tool params:", error);
      }
    } else {
      setDialogs((prev) => ({
        ...prev,
        customFunction: true,
      }));

      setEditState({
        isEditing: true,
        toolName,
        defaultValues: {
          description: tool?.function.description || "",
          functionConfig: {
            name: tool?.function.name || "",
            description: tool?.function.description || "",
            parameters: tool?.function.parameters || {},
            key: tool?.function.key || "",
            value: {
              method: toolParams?.method || "GET",
              param: toolParams?.param || {},
              url: toolParams?.url || "",
              api_token: toolParams?.api_token || null,
            },
          },
        },
      });
    }
  };

  const onSave = async () => {
    const updatePayload: CreateAgentPayload = {
      agent_prompts: {
        ...agent.agent_prompts,
      },

      agent_config: {
        ...agent.agent_config,
        tasks: agent.agent_config.tasks.map((task) => {
          if (task.task_type === "conversation") {
            return {
              ...task,
              tools_config: {
                ...task.tools_config,
                api_tools:
                  apiToolsConfig.tools && apiToolsConfig.tools?.length > 0
                    ? {
                        ...task.tools_config.api_tools,
                        tools: apiToolsConfig.tools,
                        tools_params: apiToolsConfig.tools_params,
                      }
                    : undefined,
              },
            };
          }
          return task;
        }),
      },
    };

    try {
      const result = await (agent.agent_id
        ? updateAgent(agent.agent_id, updatePayload)
        : createAgent(updatePayload));
      handleToast({
        result,
      });
      if (
        result.success &&
        result.data?.assistant_status === AssistantStatus.SEEDING
      ) {
        router.replace(`/agents/${result.data.agent_id}`);
      }
      setEditState(null);
    } catch (error) {
      console.error("Error saving API tools: ", error);
      setEditState(null);
    }
  };

  return (
    <>
      {/* Provider Select */}
      <div className="flex flex-col gap-2 items-start">
        <p className="text-xs text-muted-foreground">
          Enable your agent with capabilities such as calendar bookings, check
          slot availabilty, etc.
        </p>
        {apiToolsConfig.tools?.map((tool) => (
          <div
            key={tool.function.key}
            className="flex justify-between items-center bg-muted p-1 w-full rounded-md"
          >
            <h5 className="text-sm font-medium flex">{tool.function.key}</h5>
            <div className="flex gap-2">
              <Pencil
                className="h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => handleEditTool(tool.function.name)}
              />
              <Trash
                className="h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => handleDeleteTool(tool.function.name)}
              />
            </div>
          </div>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" type="button">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Add Functions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => toggleDialog("calendarAvailability")}
            >
              <CalendarSearch className="h-4 w-4 text-muted-foreground" />
              Check Calendar Availability (Cal.com)
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => toggleDialog("bookCalendar")}
            >
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              Book on the Calendar (Cal.com)
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => toggleDialog("transferCall")}
            >
              <PhoneForwarded className="h-4 w-4 text-muted-foreground" />
              Transfer Call to human agent
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => toggleDialog("customFunction")}
            >
              <SquareFunction className="h-4 w-4 text-muted-foreground" />
              Custom Function
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave}>
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>

      {/* Dialogs */}
      <CalendarAvailabilityDialog
        isOpen={dialogs.calendarAvailability}
        onClose={() => toggleDialog("calendarAvailability")}
        onSave={updateApiTools}
        apiToolsConfig={apiToolsConfig}
        editState={editState}
      />
      <BookCalendarDialog
        isOpen={dialogs.bookCalendar}
        onClose={() => toggleDialog("bookCalendar")}
        onSave={updateApiTools}
        apiToolsConfig={apiToolsConfig}
        editState={editState}
      />
      <TransferCallDialog
        isOpen={dialogs.transferCall}
        onClose={() => toggleDialog("transferCall")}
        onSave={updateApiTools}
        apiToolsConfig={apiToolsConfig}
        editState={editState}
      />
      <CustomFunctionDialog
        isOpen={dialogs.customFunction}
        onClose={() => toggleDialog("customFunction")}
        onSave={updateApiTools}
        apiToolsConfig={apiToolsConfig}
        editState={editState}
      />
    </>
  );
};

export default FunctionsSection;
