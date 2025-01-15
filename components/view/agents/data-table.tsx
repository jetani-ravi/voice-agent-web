"use client";

import React from "react";
import { Agent } from "@/app/modules/agents/interface";
import { Pagination } from "@/types/api";
import { columns } from "./columns";
import ControlledTable from "@/components/ui/table/controlled-table";
import { useRouter } from "next/navigation";

interface DataTableProps {
  agents: Agent[];
  pagination: Pagination;
}

const DataTable = ({ agents, pagination }: DataTableProps) => {
  const searchableColumns = ["agent_config.agent_name", "created_at"];

  const router = useRouter();
  const memoizedColumns = React.useMemo(() => columns, []);

  const handleRowClick = (row: Agent) => {
    router.push(`/agents/${row.agent_id}`);
  };

  return (
    <ControlledTable
      columns={memoizedColumns}
      data={agents}
      pageCount={Math.ceil(pagination.count / pagination.limit)}
      searchableColumns={searchableColumns}
      onRowClick={handleRowClick}
    />
  );
};

export default DataTable;
