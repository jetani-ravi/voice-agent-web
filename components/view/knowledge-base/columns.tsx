"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit2, Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DataTableColumnHeader } from "@/components/ui/table/header";
import { Checkbox } from "@/components/ui/checkbox";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import DeletePopover from "@/components/delete-popover";
import { Badge } from "@/components/ui/badge";
import { KNOWLEDGE_BASE_STATUS } from "@/constants/knowledgeBase";
import { formatDateTime } from "@/lib/date-time";

interface GetColumnsProps {
  onEdit: (knowledgeBase: KnowledgeBase) => void;
  onDelete: (knowledgeBase: KnowledgeBase) => void;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case KNOWLEDGE_BASE_STATUS.PENDING:
      return <Badge variant="subtle-warning">Pending</Badge>;
    case KNOWLEDGE_BASE_STATUS.PROCESSING:
      return <Badge variant="subtle-info">Processing</Badge>;
    case KNOWLEDGE_BASE_STATUS.COMPLETE:
      return <Badge variant="subtle-success">Complete</Badge>;
    case KNOWLEDGE_BASE_STATUS.FAILED:
      return <Badge variant="subtle-destructive">Failed</Badge>;
  }
};

export const getColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<KnowledgeBase>[] => [
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
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      viewKey: "Name",
    },
  },
  {
    id: "file_name",
    accessorKey: "file_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Name" />
    ),
    sortingFn: "text",
    meta: {
      viewKey: "File Name",
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
      const knowledgeBase = row.original;

      const copyRagId = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigator.clipboard.writeText(knowledgeBase.vector_id!);
        toast({
          title: "Rag ID copied to clipboard",
          description: "You can now paste it anywhere you need.",
        });
      };

      const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit(knowledgeBase);
      };

      const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(knowledgeBase);
      };

      return (
        <div className="flex items-center gap-1">
          {/* Copy Vector ID */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={copyRagId}
          >
            <Clipboard className="h-4 w-4" />
            <span className="sr-only">Copy Rag ID</span>
          </Button>
          {/* Edit Knowledge Base */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={handleEdit}
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit Knowledge Base</span>
          </Button>
          {/* Delete Knowledge Base */}
          <DeletePopover onDelete={handleDelete} />
        </div>
      );
    },
  },
];
