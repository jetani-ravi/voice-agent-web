"use client";

import React from "react";
import { Pagination } from "@/types/api";
import { getColumns } from "./columns";
import ControlledTable from "@/components/ui/table/controlled-table";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { ApiKey } from "@/app/modules/api-keys/interface";
import { deleteApiKey } from "@/app/modules/api-keys/action";

interface DataTableProps {
  apiKeys: ApiKey[];
  pagination: Pagination;
}

const DataTable = ({ apiKeys, pagination }: DataTableProps) => {
  const sortableColumns = ["name", "expires_at", "last_accessed_at", "created_at"];
  const { handleToast } = useToastHandler();

  const onDelete = async (apiKey: ApiKey) => {
    try {
      const result = await deleteApiKey(apiKey._id!);
      handleToast({ result });
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    }
  };

  const memoizedColumns = React.useMemo(
    () => getColumns({ onDelete }),
    [onDelete]
  );

  return (
    <>
      <ControlledTable
        columns={memoizedColumns}
        data={apiKeys}
        pageCount={Math.ceil(pagination.count / pagination.limit)}
        sortableColumns={sortableColumns}
      />
    </>
  );
};

export default DataTable;
