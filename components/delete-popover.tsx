import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeletePopoverProps {
  onDelete: (event: React.MouseEvent) => void;
  title?: string;
  description?: string;
  disabled?: boolean;
}

const DeletePopover = ({
  onDelete,
  title = "Are you sure you want to delete this?",
  description = "This action cannot be undone.",
  disabled = false,
}: DeletePopoverProps) => {
  const [open, setOpen] = React.useState(false);

  const togglePopover = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(event);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={togglePopover} disabled={disabled}>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete Agent</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={togglePopover}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={disabled}
          >
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeletePopover;
