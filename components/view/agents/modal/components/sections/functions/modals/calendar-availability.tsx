"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarSearch } from "lucide-react";
import {
  APIParams,
  ToolDescription,
  ToolModel,
} from "@/app/modules/agents/interface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateToolName, API_TOOLS } from "@/constants/agent";
import { timezones } from "@/lib/date-time";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: ToolDescription, toolParams: APIParams) => void;
  apiToolsConfig: ToolModel;
  editState: {
    isEditing: boolean;
    toolName: string;
    defaultValues: {
      description: string;
      apiKey: string;
      eventType: string;
      timezone: string;
    };
  } | null;
}

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  apiKey: z.string().min(1, "API Key is required"),
  eventType: z.string().min(1, "Event Type is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

const CalendarAvailabilityDialog = ({
  isOpen,
  onClose,
  onSave,
  editState,
}: Props) => {
  const [eventTypes, setEventTypes] = useState<{ id: string; title: string }[]>(
    []
  );
  const [isLoadingEventTypes, setIsLoadingEventTypes] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editState?.defaultValues || {
      description: API_TOOLS.CALENDAR_AVAILABILITY.description,
      apiKey: "",
      eventType: "",
      timezone: "",
    },
  });

  useEffect(() => {
    if (isOpen && editState?.defaultValues) {
      form.reset(editState.defaultValues);
      // Fetch event types when in edit mode
      fetchEventTypes(editState.defaultValues.apiKey);
    } else if (!isOpen) {
      form.reset({
        description: API_TOOLS.CALENDAR_AVAILABILITY.description,
        apiKey: "",
        eventType: "",
        timezone: "",
      });
    }
  }, [isOpen, editState]);

  const fetchEventTypes = async (apiKey: string) => {
    setIsLoadingEventTypes(true);
    try {
      const response = await fetch("https://api.cal.com/v2/event-types", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch event types");
      }
      const data = await response.json();
      setEventTypes(
        data.data.eventTypeGroups[0].eventTypes.map((et: any) => ({
          id: String(et.id),
          title: et.title,
        }))
      );
      form.clearErrors("apiKey");
    } catch (error) {
      console.error(error);
      form.setError("apiKey", {
        type: "manual",
        message: "Invalid or expired API key",
      });
      setEventTypes([]);
    } finally {
      setIsLoadingEventTypes(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const toolName = editState?.isEditing
      ? editState.toolName
      : generateToolName("check_availability_of_slots");

    const newTool: ToolDescription = {
      name: toolName,
      description: values.description,
      parameters: API_TOOLS.CALENDAR_AVAILABILITY.parameters,
      key: API_TOOLS.CALENDAR_AVAILABILITY.key,
    };

    const offset = timezones.find((tz) => tz.value === values.timezone)?.offset;

    const newToolParams: APIParams = {
      method: API_TOOLS.CALENDAR_AVAILABILITY.method,
      param: JSON.stringify({
        eventTypeId: values.eventType,
        startTime: `%(startTime)s${offset}`,
        endTime: `%(endTime)s${offset}`,
        timeZone: values.timezone,
      }),
      url: `${API_TOOLS.CALENDAR_AVAILABILITY.baseUrl}?apiKey=${values.apiKey}`,
      api_token: values.apiKey,
    };

    onSave(newTool, newToolParams);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarSearch className="h-5 w-5" /> Check Calendar Availability
            (Cal.com)
          </DialogTitle>
          <DialogDescription>
            Enter your Cal.com details for {API_TOOLS.CALENDAR_AVAILABILITY.key}{" "}
            function
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Prompt)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter description"
                      rows={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key (Cal.com)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter API key"
                      onBlur={(e) => {
                        field.onBlur();
                        fetchEventTypes(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {isLoadingEventTypes && (
                    <FormDescription className="text-right">
                      Checking...
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type (Cal.com)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingEventTypes || eventTypes.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((eventType) => (
                          <SelectItem key={eventType.id} value={eventType.id}>
                            {eventType.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={timezones}
                      defaultValue={field.value}
                      onChange={field.onChange}
                      placeholder="Select timezone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarAvailabilityDialog;
