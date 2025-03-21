"use client";

import { ExecutionModel } from "@/app/modules/call-history/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text, ChartScatter, Braces } from "lucide-react";

interface AnalysisTabProps {
  execution: ExecutionModel;
}

export function AnalysisTab({ execution }: AnalysisTabProps) {
  // Extract analysis data from execution
  const summary = execution.summary;
  const extractedData = execution.extracted_data;
  const contextData = execution.context_details;
  
  // Since success_evaluation doesn't exist in the ExecutionModel interface,
  // we'll check if it exists in the execution object
  const successEvaluation = (execution as any).success_evaluation;
  
  return (
    <div className="py-4 space-y-6">
      {/* Summary */}
      {summary && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Text className="h-4 w-4" />
              <span>Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">This is the summary of the call.</p>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto text-wrap">
              {summary}
            </pre>
          </CardContent>
        </Card>
      )}
      
      {/* Extracted Data */}
      {extractedData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ChartScatter className="h-4 w-4" />
              <span>Extracted Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">This is the data extracted based on the Conversation.</p>
            {typeof extractedData === 'object' ? (
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto text-wrap">
                {JSON.stringify(extractedData, null, 2)}
              </pre>
            ) : (
              <p>{extractedData}</p>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Context Data */}
      {contextData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Braces className="h-4 w-4" />
              <span>Context Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {typeof contextData === 'object' ? (
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto text-wrap">
                {JSON.stringify(contextData, null, 2)}
              </pre>
            ) : (
              <p>{contextData}</p>
            )}
          </CardContent>
        </Card>
      )}
      
      {!summary && !extractedData && !contextData && !successEvaluation && (
        <div className="py-6 text-center text-muted-foreground">
          <p>No analysis data available for this call.</p>
        </div>
      )}
    </div>
  );
} 