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
  ToolFunction,
  APIParams,
} from "@/app/modules/agents/interface";
import { JsonEditor, githubDarkTheme, defaultTheme } from "json-edit-react";
import { API_TOOLS, generateToolName } from "@/constants/agent";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: ToolFunction, toolParams: APIParams) => void;
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
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      setIsDarkMode(true);
    } else if (theme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, [theme]);

  const { toast } = useToast();
  useEffect(() => {
    if (isOpen && editState?.isEditing) {
      const existingTool = apiToolsConfig.tools?.find(
        (t) => t.function.name === editState.toolName
      );
      const existingParams = apiToolsConfig.tools_params[editState.toolName];

      if (existingTool && existingParams) {
        setJsonData({
          name: existingTool.function.name,
          description: existingTool.function.description,
          parameters: existingTool.function.parameters as any,
          key: existingTool.function.key,
          value: {
            method: existingParams.method as string,
            param: existingParams.param as string,
            url: existingParams.url as string,
            api_token: existingParams.api_token as string
          },
        });
      }
    } else {
      const uniqueKey = generateToolName();
      setJsonData({
        ...API_TOOLS.CUSTOM_FUNCTION,
        key: `custom_${uniqueKey}`,
      });
    }
  }, [isOpen, editState, apiToolsConfig]);

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

      const toolDescription: ToolFunction = {
        type: "function",
        function: {
          name: jsonData.name,
          description: jsonData.description,
          parameters: jsonData.parameters || {},
          key: jsonData.key,
        },
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
      handleClose();
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

  const handleClose = () => {
    setJsonData(API_TOOLS.CUSTOM_FUNCTION);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[60%] h-[90vh]">
        <DialogHeader>
          <DialogTitle>Your Custom Function Configuration</DialogTitle>
          <DialogDescription>
            Edit the function configuration. Required fields: name, description,
            key, and value.method. The value object should contain method,
            param, url, and api_token (optional).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 h-full overflow-y-auto">
          <JsonEditor
            data={jsonData}
            minWidth="100%"
            setData={setJsonData as any}
            theme={[isDarkMode ? githubDarkTheme : defaultTheme, {
              input: {
                backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
              },
            }]}
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
