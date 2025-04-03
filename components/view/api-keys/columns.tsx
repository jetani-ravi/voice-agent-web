"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/table/header";
import { Checkbox } from "@/components/ui/checkbox";
import DeletePopover from "@/components/delete-popover";
import { formatDateTime } from "@/lib/date-time";
import type { ApiKey } from "@/app/modules/api-keys/interface";
import { Badge } from "@/components/ui/badge";
import type React from "react"; // Import React
import { differenceInDays } from "date-fns";

interface GetColumnsProps {
  onDelete: (apiKey: ApiKey) => void;
}

export const getColumns = ({
  onDelete,
}: GetColumnsProps): ColumnDef<ApiKey>[] => [
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
    id: "display_value",
    accessorKey: "display_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      viewKey: "Key",
    },
  },
  {
    id: "expires_at",
    accessorKey: "expires_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires in" />
    ),
    cell: ({ row }) => {
      const expiresAt = new Date(row.getValue("expires_at"));
      const now = new Date();
      const diffDays = differenceInDays(expiresAt, now);

      return (
        <div className="flex items-center gap-2">
          {diffDays > 0 ? (
            `${diffDays} day${diffDays === 1 ? "" : "s"}`
          ) : (
            <Badge variant="subtle-destructive">Expired</Badge>
          )}
        </div>
      );
    },
    sortingFn: "datetime",
    meta: {
      viewKey: "Expires in",
    },
  },
  {
    id: "last_accessed_at",
    accessorKey: "last_accessed_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Accessed At" />
    ),
    cell: ({ row }) => {
      const accessedDate: string = row.getValue("last_accessed_at");
      if (accessedDate) {
        const date = new Date(accessedDate);
        return formatDateTime(date);
      }
      return "Never";
    },
    sortingFn: "datetime",
    meta: {
      viewKey: "Last Accessed At",
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
      const apiKey = row.original;

      const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(apiKey);
      };

      return (
        <div className="flex items-center gap-1">
          {/* Delete API Key */}
          <DeletePopover onDelete={handleDelete} />
        </div>
      );
    },
  },
];
