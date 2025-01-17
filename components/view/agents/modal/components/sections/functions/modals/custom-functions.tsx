"use client";

import React, { useState, useEffect } from "react";
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
  ToolModel,
  ToolDescription,
  APIParams,
} from "@/app/modules/agents/interface";
import { JsonEditor } from "json-edit-react";
import { API_TOOLS } from "@/constants/api-tools";
import { useToast } from "@/hooks/use-toast";

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
      functionConfig: any;
    };
  } | null;
}

const CustomFunctionDialog = ({
  isOpen,
  onClose,
  onSave,
  apiToolsConfig,
  editState,
}: Props) => {
  const [jsonData, setJsonData] = useState(API_TOOLS.CUSTOM_FUNCTION);
  const { toast } = useToast();
  useEffect(() => {
    if (isOpen && editState?.isEditing) {
      const existingTool = apiToolsConfig.tools?.find(
        (t) => t.name === editState.toolName
      );
      const existingParams = apiToolsConfig.tools_params[editState.toolName];

      if (existingTool && existingParams) {
        setJsonData({
          name: existingTool.name,
          description: existingTool.description,
          parameters: existingTool.parameters as any,
          key: existingTool.key,
          value: {
            method: existingParams.method as string,
            param:
              typeof existingParams.param === "string"
                ? JSON.parse(existingParams.param)
                : existingParams.param,
            url: existingParams.url as string,
            api_token: existingParams.api_token as string,
          },
        });
      }
    } else {
      setJsonData(API_TOOLS.CUSTOM_FUNCTION);
    }
  }, [isOpen, editState, apiToolsConfig]);

  const handleJsonChange = (newData: any) => {
    setJsonData(newData as any);
  };

  const handleSave = () => {
    try {
      // Validate required fields
      const requiredFields = ["name", "description", "key", "value"] as const;
      const missingFields = requiredFields.filter(
        (field) => !jsonData[field as keyof typeof jsonData]
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      if (!jsonData.value.method) {
        throw new Error("Method is required in value object");
      }

      const toolDescription: ToolDescription = {
        name: jsonData.name,
        description: jsonData.description,
        parameters: jsonData.parameters || {},
        key: jsonData.key,
      };

      const toolParams: APIParams = {
        method: jsonData.value.method,
        param:
          typeof jsonData.value.param === "string"
            ? jsonData.value.param
            : JSON.stringify(jsonData.value.param),
        url: jsonData.value.url || "",
        api_token: jsonData.value.api_token || undefined,
      };

      onSave(toolDescription, toolParams);
      onClose();
    } catch (error) {
      toast({
        title: "Error saving custom function",
        description:
          error instanceof Error
            ? error.message
            : "Error saving custom function",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%]">
        <DialogHeader>
          <DialogTitle>Your Custom Function Configuration</DialogTitle>
          <DialogDescription>
            Edit the function configuration. Required fields: name, description,
            key, and value.method. The value object should contain method,
            param, url, and api_token (optional).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <JsonEditor
            data={jsonData}
            minWidth="100%"
            onChange={handleJsonChange as any}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomFunctionDialog;
