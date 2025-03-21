"use client";

import { ExecutionModel } from "@/app/modules/call-history/interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/date-time";
import { Info } from "lucide-react";

interface DetailsTabProps {
  execution: ExecutionModel;
}

export function DetailsTab({ execution }: DetailsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>Call Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div>
            <Badge 
              variant={
                execution.status?.toLowerCase() === "completed" 
                  ? "success" 
                  : execution.status?.toLowerCase() === "failed" 
                    ? "destructive" 
                    : "secondary"
              } 
              className="capitalize"
            >
              {execution.status}
            </Badge>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Conversation Type</p>
          <p>{execution.provider}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Direction</p>
          <div>
            {execution.telephony_data?.call_type ? (
              <Badge
                variant={
                  execution.telephony_data?.call_type === "outbound"
                    ? "success"
                    : "destructive"
                }
                className="capitalize"
              >
                {execution.telephony_data?.call_type}
              </Badge>
            ) : (
              <Badge variant="info" className="capitalize">
                {"Chat"}
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Duration</p>
          <p>{execution.conversation_time}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
          <p>${execution.total_cost}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Customer Number</p>
          <p>{execution.telephony_data?.to_number || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Created At</p>
          <p>{execution.created_at ? formatDateTime(new Date(execution.created_at)) : "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
} 