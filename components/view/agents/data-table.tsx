"use client";

import React from "react";
import { Agent } from "@/app/modules/agents/interface";
import { Pagination } from "@/types/api";
import { getColumns } from "./columns";
import ControlledTable from "@/components/ui/table/controlled-table";
import { useRouter } from "next/navigation";
import { deleteAgent } from "@/app/modules/agents/action";
import { useToastHandler } from "@/hooks/use-toast-handler";

interface DataTableProps {
  agents: Agent[];
  pagination: Pagination;
}

const DataTable = ({ agents, pagination }: DataTableProps) => {
  const searchableColumns = ["agent_config.agent_name", "created_at"];
  const router = useRouter();
  const { handleToast } = useToastHandler();
  const onEdit = (agent: Agent) => {
    router.push(`/agents/${agent.agent_id}`);
  };

  const onDelete = async (agent: Agent) => {
    try {
      const result = await deleteAgent(agent.agent_id!);
      handleToast({ result });
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    }
  };

  const memoizedColumns = React.useMemo(
    () => getColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

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
