"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PhoneForwarded } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateToolName, API_TOOLS } from "@/constants/agent";

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
      callTransferNumber: string;
    };
  } | null;
}

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  callTransferNumber: z.string().min(1, "Call Transfer Number is required"),
});

const TransferCallDialog = ({ isOpen, onClose, onSave, editState }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editState?.defaultValues || {
      description: API_TOOLS.TRANSFER_CALL.description,
      callTransferNumber: "",
    },
  });

  useEffect(() => {
    if (isOpen && editState?.defaultValues) {
      form.reset(editState.defaultValues);
    } else if (!isOpen) {
      form.reset({
        description: API_TOOLS.TRANSFER_CALL.description,
        callTransferNumber: "",
      });
    }
  }, [isOpen, editState]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const toolName = editState?.isEditing
      ? editState.toolName
      : generateToolName("transfer_call");

    const newTool: ToolDescription = {
      name: toolName,
      description: values.description,
      parameters: API_TOOLS.TRANSFER_CALL.parameters,
      key: API_TOOLS.TRANSFER_CALL.key,
    };

    const newToolParams: APIParams = {
      method: API_TOOLS.TRANSFER_CALL.method,
      param: JSON.stringify({
        call_transfer_number: values.callTransferNumber,
        call_sid: "%(call_sid)s",
      }),
      api_token: undefined,
    };

    onSave(newTool, newToolParams);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PhoneForwarded className="h-5 w-5" /> Transfer Call Configuration
          </DialogTitle>
          <DialogDescription>
            Use this to transfer a call to a human agent
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
              name="callTransferNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer To Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+919876543210" />
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

export default TransferCallDialog;
