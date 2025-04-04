import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeletePopoverProps {
  onDelete: (event: React.MouseEvent) => void;
  title?: string;
  description?: string;
  disabled?: boolean;
  align?: "center" | "end" | "start";
  className?: string;
}

const DeletePopover = ({
  onDelete,
  title = "Are you sure you want to delete this?",
  description = "This action cannot be undone.",
  disabled = false,
  align = "end",
  className = "",
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
          className={cn(
            "text-muted-foreground hover:text-destructive",
            className
          )}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
          <span className="sr-only">Delete Agent</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align}>
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
