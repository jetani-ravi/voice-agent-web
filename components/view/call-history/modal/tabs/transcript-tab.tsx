"use client";

import { ExecutionModel } from "@/app/modules/call-history/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface TranscriptTabProps {
  execution: ExecutionModel;
}

interface Message {
  role: "ai" | "user";
  content: string;
}

export function TranscriptTab({ execution }: TranscriptTabProps) {
  // Parse transcript if it exists
  // This is a simplified example - you'll need to adapt this to your actual transcript format
  const messages: Message[] = [];
  
  if (execution.transcript) {
    // Simple parsing logic - adjust based on your actual transcript format
    const lines = execution.transcript.split('\n');
    let currentRole: "ai" | "user" | null = null;
    let currentContent = "";
    
    for (const line of lines) {
      if (line.startsWith("assistant:") || line.toLowerCase().includes("assistant:")) {
        // Save previous message if exists
        if (currentRole) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = "ai";
        currentContent = line.replace(/^assistant:|^Assistant:/i, "").trim();
      } else if (line.startsWith("user:") || line.toLowerCase().includes("user:")) {
        // Save previous message if exists
        if (currentRole) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = "user";
        currentContent = line.replace(/^user:|^User:/i, "").trim();
      } else if (currentRole) {
        // Continue current message
        currentContent += " " + line.trim();
      }
    }
    
    // Add the last message
    if (currentRole) {
      messages.push({ role: currentRole, content: currentContent.trim() });
    }
  }
  
  if (messages.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <p>No transcript available for this call.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Transcript</span>
        </CardTitle> 
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={cn(
              "py-2",
              message.role === "ai" ? "border-l-4 border-teal-500 pl-4" : "border-l-4 border-blue-500 pl-4"
            )}
          >
            <div className={cn(
              "font-medium mb-1",
              message.role === "ai" ? "text-teal-600 dark:text-teal-400" : "text-blue-600 dark:text-blue-400"
            )}>
              {message.role === "ai" ? "AI" : "User"}
            </div>
            <div className="text-sm">{message.content}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 