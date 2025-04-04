"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Agent } from "@/app/modules/agents/interface";
import { Button } from "@/components/ui/button";
import { Edit2, Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DataTableColumnHeader } from "@/components/ui/table/header";
import { Checkbox } from "@/components/ui/checkbox";
import DeletePopover from "../../delete-popover";
import { formatDateTime } from "@/lib/date-time";

interface GetColumnsProps {
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Agent>[] => [
  {
    id: "select",
    accessorKey: "select",
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
    meta: {
      viewKey: "Select",
    },
  },
  {
    id: "agent_id",
    accessorKey: "agent_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agent ID" />
    ),
    enableSorting: false,
    meta: {
      viewKey: "Agent ID",
    },
  },
  {
    id: "agent_config.agent_name",
    accessorKey: "agent_config.agent_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    sortingFn: "text",
    meta: {
      viewKey: "Name",
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
      const agent = row.original;

      const copyAgentId = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigator.clipboard.writeText(agent.agent_id!);
        toast({
          title: "Agent ID copied to clipboard",
          description: "You can now paste it anywhere you need.",
        });
      };

      const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit(agent);
      };

      const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(agent);
      };

      return (
        <div className="flex items-center gap-1">
          {/* Copy Agent ID */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={copyAgentId}
          >
            <Clipboard className="h-4 w-4" />
            <span className="sr-only">Copy Agent ID</span>
          </Button>
          {/* Edit Agent */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={handleEdit}
          >
            <Edit2 className="h-4 w-4 text-info" />
            <span className="sr-only">Edit Agent</span>
          </Button>
          {/* Delete Agent */}
          <DeletePopover onDelete={handleDelete} />
        </div>
      );
    },
  },
];
