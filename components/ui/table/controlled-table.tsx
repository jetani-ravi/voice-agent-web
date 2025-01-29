"use client";

import React, { useCallback, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { DataTablePagination } from "@/components/ui/table/paginations";
import { DataTableViewOptions } from "./view-options";

interface ControlledTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  sortableColumns: string[];
  filterElements?: React.ReactNode;
  canSearch?: boolean;
  canViewOptions?: boolean;
  onRowClick?: (row: TData) => void;
  searchPlaceholder?: string;
}

const ControlledTable = <TData, TValue>({
  columns,
  data,
  pageCount,
  sortableColumns,
  filterElements,
  canSearch = true,
  canViewOptions = true,
  onRowClick,
  searchPlaceholder = "Search...",
}: ControlledTableProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get("search") || ""
  );

  const currentPage = Number(searchParams?.get("page") || "1");
  const pageSize = Number(searchParams?.get("limit") || "10");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    manualPagination: true,
    pageCount: pageCount,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateSearchParams = useCallback(
    debounce((newSearchParams: URLSearchParams) => {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }, 300),
    [router, pathname]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("search", e.target.value);
    newSearchParams.set("page", "1");
    setSearchTerm(e.target.value);
    debouncedUpdateSearchParams(newSearchParams);
  };

  const handleSort = (columnId: string) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    const currentOrder = newSearchParams.get("order");
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    newSearchParams.set("sort", columnId);
    newSearchParams.set("order", newOrder);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("page", (page + 1).toString());
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("limit", newPageSize.toString());
    newSearchParams.set("page", "1");
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {canSearch && (
          <div className="flex gap-2 items-center">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        )}
        {canViewOptions && <DataTableViewOptions table={table} />}
      </div>
      {filterElements && (
        <div className="flex justify-end mb-4">{filterElements}</div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort() &&
                          sortableColumns.includes(header.id)
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={() =>
                          header.column.getCanSort() &&
                          sortableColumns.includes(header.id) &&
                          handleSort(header.id)
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default ControlledTable;
