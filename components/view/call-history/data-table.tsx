"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Pagination } from "@/types/api";
import { getColumns } from "./columns";
import ControlledTable from "@/components/ui/table/controlled-table";
import {
  ExecutionModel,
  ExecutionStatus,
} from "@/app/modules/call-history/interface";
import { ExecutionDetails } from "./modal/execution-details";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";

interface DataTableProps {
  executions: ExecutionModel[];
  pagination: Pagination;
}

// Define providers constant
const PROVIDERS = [
  { label: "Twilio", value: "twilio" },
  { label: "Plivo", value: "plivo" },
  { label: "WebSocket", value: "websocket" },
];

// Define call directions
const CALL_DIRECTIONS = [
  { label: "Inbound", value: "inbound" },
  { label: "Outbound", value: "outbound" },
];

const DataTable = ({ executions, pagination }: DataTableProps) => {
  const sortableColumns = [
    "provider",
    "status",
    "conversation_time",
    "total_cost",
    "created_at",
    "telephony_data.call_type",
    "telephony_data.to_number",
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedExecution, setSelectedExecution] =
    useState<ExecutionModel | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [filters, setFilters] = useState({
    provider: searchParams.get("provider") || "",
    status: searchParams.get("status") || "",
    direction: searchParams.get("direction") || "",
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
  });

  // Initialize date from URL params if they exist
  useEffect(() => {
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    if (startDate || endDate) {
      setDate({
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined,
      });
    }
  }, [searchParams]);

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const onViewDetails = (execution: ExecutionModel) => {
    setSelectedExecution(execution);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const memoizedColumns = React.useMemo(
    () => getColumns({ onViewDetails }),
    [onViewDetails]
  );

  // Update search params and apply filters
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });

      newSearchParams.set("page", "1");
      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      updateSearchParams({ [key]: value });
    },
    [updateSearchParams]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      provider: "",
      status: "",
      direction: "",
      start_date: "",
      end_date: "",
    });
    setDate({ from: undefined, to: undefined });

    const newSearchParams = new URLSearchParams();
    router.push(
      pathname +
        (newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""),
      { scroll: false }
    );
  }, [pathname, router]);

  // Handle date range selection
  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);

    // Close the date picker if both dates are selected
    if (selectedDate?.from && selectedDate?.to) {
      setDatePickerOpen(false);
    }

    // Update the filters and URL params
    const updates: Record<string, string | null> = {};

    if (selectedDate?.from) {
      updates.start_date = selectedDate.from.toISOString();
    } else {
      updates.start_date = null;
    }

    if (selectedDate?.to) {
      updates.end_date = selectedDate.to.toISOString();
    } else {
      updates.end_date = null;
    }

    // Update both filters and search params at once
    setFilters((prev) => ({
      ...prev,
      start_date: updates.start_date || "",
      end_date: updates.end_date || "",
    }));

    updateSearchParams(updates);
  };

  // Create status options from ExecutionStatus enum
  const statusOptions = Object.values(ExecutionStatus).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " "),
    value: status,
  }));

  const formatDate = (date: Date) => {
    return format(date, "LLL dd, y");
  };

  const formatDateRange = (date: DateRange) => {
    if (date.from && date.to) {
      return `${formatDate(date.from)} - ${formatDate(date.to)}`;
    }
    return formatDate(date.from || date.to || new Date());
  };

  const filterElements = (
    <div className="flex flex-wrap flex-grow gap-4">
      <SearchableSelect
        options={PROVIDERS}
        placeholder="Select Provider"
        defaultValue={filters.provider}
        onChange={(value) => handleFilterChange("provider", value)}
      />
      <SearchableSelect
        options={statusOptions}
        placeholder="Select Status"
        defaultValue={filters.status}
        onChange={(value) => handleFilterChange("status", value)}
      />
      <SearchableSelect
        options={CALL_DIRECTIONS}
        placeholder="Select Direction"
        defaultValue={filters.direction}
        onChange={(value) => handleFilterChange("direction", value)}
      />

      {/* Date Range Calendar */}
      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? formatDateRange(date) : "Select Date Range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        onClick={clearFilters}
        className="hover:text-destructive"
        disabled={!hasActiveFilters}
      >
        <X className="h-4 w-4 mr-2" />
        Clear
      </Button>
    </div>
  );

  return (
    <>
      <ControlledTable
        columns={memoizedColumns}
        data={executions}
        filterElements={filterElements}
        pageCount={Math.ceil(pagination.count / pagination.limit)}
        sortableColumns={sortableColumns}
        initialPageSize={pagination.limit}
        alignFiltersToSearch="start"
        onRowClick={onViewDetails}
      />

      <ExecutionDetails
        execution={selectedExecution}
        open={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </>
  );
};

export default DataTable;
