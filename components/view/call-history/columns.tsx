"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Copy, Eye, PieChart } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/table/header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ExecutionStatus,
  ExecutionModel,
} from "@/app/modules/call-history/interface";
import { formatDateTime } from "@/lib/date-time";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
interface GetColumnsProps {
  onViewDetails: (execution: ExecutionModel) => void;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case ExecutionStatus.PENDING:
      return (
        <Badge variant="warning" className="capitalize">
          {status}
        </Badge>
      );
    case ExecutionStatus.IN_PROGRESS:
    case ExecutionStatus.BUSY:
    case ExecutionStatus.RINGING:
    case ExecutionStatus.QUEUED:
    case ExecutionStatus.INITIATED:
      return (
        <Badge variant="info" className="capitalize ">
          {status}
        </Badge>
      );
    case ExecutionStatus.COMPLETED:
      return (
        <Badge variant="success" className="capitalize">
          {status}
        </Badge>
      );
    case ExecutionStatus.CANCELLED:
    case ExecutionStatus.FAILED:
      return (
        <Badge variant="destructive" className="capitalize">
          {status}
        </Badge>
      );
  }
};

export const getColumns = ({
  onViewDetails,
}: GetColumnsProps): ColumnDef<ExecutionModel>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "execution_id",
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Execution ID" />
    ),
    meta: {
      viewKey: "Execution ID",
    },
    enableSorting: false,
    cell: ({ row }) => {
      const copyToClipboard = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(row.original._id);
        toast({
          title: "Execution ID copied to clipboard",
          description: "You can now paste it anywhere you need.",
        });
      };
      const execution = row.original;
      return (
        <div className="flex items-center gap-1">
          {/* Show First few characters and then ...* last few characters */}
          <span>
            {execution._id.slice(0, 10)}...{execution._id.slice(-5)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    id: "provider",
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Conversation Type" />
    ),
    sortingFn: "text",
    meta: {
      viewKey: "Conversation Type",
    },
  },
  {
    id: "telephony_data.call_type",
    accessorKey: "telephony_data.call_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Direction" />
    ),
    meta: {
      viewKey: "Direction",
    },
    cell: ({ row }) => {
      const execution = row.original;
      return execution.telephony_data?.call_type ? (
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
      );
    },
  },
  {
    id: "conversation_time",
    accessorKey: "conversation_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (in seconds)" />
    ),
    meta: {
      viewKey: "Duration (in seconds)",
    },
  },
  {
    id: "total_cost",
    accessorKey: "total_cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Cost" />
    ),
    meta: {
      viewKey: "Total Cost",
    },
    cell: ({ row }) => {
      const execution = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>${execution.total_cost}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <PieChart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-background text-foreground min-w-[300px]" align="start">
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm my-2">
                  {Object.entries(execution.cost_breakdown || {}).map(
                    ([key, value]) => (
                      <Card
                        key={key}
                        className="flex flex-col items-start gap-1 rounded-md p-2"
                      >
                        <span className="capitalize text-sm font-medium">
                          {key}
                        </span>
                        <span className="text-xl font-bold">${value}</span>
                      </Card>
                    )
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "telephony_data.to_number",
    accessorKey: "telephony_data.to_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Number" />
    ),
    meta: {
      viewKey: "Customer Number",
    },
    cell: ({ row }) => {
      const execution = row.original;
      return execution.telephony_data?.to_number ? (
        <span>{execution.telephony_data?.to_number}</span>
      ) : ( 
        <span>N/A</span>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.original.status),
    sortingFn: "text",
    meta: {
      viewKey: "Status",
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return formatDateTime(date);
    },
    sortingFn: "datetime",
    meta: {
      viewKey: "Created At",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const execution = row.original;

      const handleViewDetails = (event: React.MouseEvent) => {
        event.stopPropagation();
        onViewDetails(execution);
      };

      return (
        <div className="flex items-center gap-1">
          {/* View Details */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
        </div>
      );
    },
  },
];
