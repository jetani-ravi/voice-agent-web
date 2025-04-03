"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DataTableColumnHeader } from "@/components/ui/table/header";
import { Checkbox } from "@/components/ui/checkbox";
import DeletePopover from "@/components/delete-popover";
import { formatDateTime } from "@/lib/date-time";
import { PhoneNumber } from "@/app/modules/phone-numbers/interface";
import { Badge } from "@/components/ui/badge";

interface GetColumnsProps {
  onDelete: (phoneNumber: PhoneNumber) => void;
}

const getYesNoBadge = (value: boolean) => {
  return (
    <Badge variant={value ? "subtle-success" : "subtle-warning"}>
      {value ? "Yes" : "No"}
    </Badge>
  );
};

export const getColumns = ({
  onDelete,
}: GetColumnsProps): ColumnDef<PhoneNumber>[] => [
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
    id: "phone_number",
    accessorKey: "phone_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    sortingFn: "text",
    meta: {
      viewKey: "Phone Number",
    },
  },
  {
    id: "properties.friendly_name",
    accessorKey: "properties.friendly_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Friendly Name" />
    ),
    sortingFn: "text",
    meta: {
      viewKey: "Friendly Name",
    },
  },
  {
    id: "telephony_provider",
    accessorKey: "telephony_provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telephony Provider" />
    ),
    sortingFn: "text",
    meta: {
      viewKey: "Telephony Provider",
    },
  },
  {
    id: "purchased",
    accessorKey: "purchased",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchased" />
    ),
    cell: ({ row }) => getYesNoBadge(row.getValue("purchased")),
    sortingFn: "text",
    meta: {
      viewKey: "Purchased",
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
      const phoneNumber = row.original;

      const copyPhoneNumber = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigator.clipboard.writeText(phoneNumber.phone_number!);
        toast({
          title: "Phone number copied to clipboard",
          description: "You can now paste it anywhere you need.",
        });
      };

      const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(phoneNumber);
      };

      return (
        <div className="flex items-center gap-1">
          {/* Copy Phone Number */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={copyPhoneNumber}
          >
            <Clipboard className="h-4 w-4" />
            <span className="sr-only">Copy Phone Number</span>
          </Button>
          {/* Delete Phone Number */}
          <DeletePopover
            onDelete={handleDelete}
            title="Are you sure you want to delete this phone number?"
            description="Phone numbers will be released from your account and will no longer be available for use."
            disabled={!phoneNumber.purchased}
          />
        </div>
      );
    },
  },
];
