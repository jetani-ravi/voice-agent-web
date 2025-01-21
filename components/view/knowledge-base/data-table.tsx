"use client";

import React, { useState } from "react";
import { Pagination } from "@/types/api";
import { getColumns } from "./columns";
import ControlledTable from "@/components/ui/table/controlled-table";
import { deleteKnowledgeBase } from "@/app/modules/knowledgebase/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import KnowledgeBaseForm from "./components/knowledge-base-form";

interface DataTableProps {
  knowledgeBases: KnowledgeBase[];
  pagination: Pagination;
}

const DataTable = ({ knowledgeBases, pagination }: DataTableProps) => {
  const sortableColumns = ["name", "fileName", "status", "created_at"];
  const [open, setOpen] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(
    null
  );
  const { handleToast } = useToastHandler();

  const onEdit = (knowledgeBase: KnowledgeBase) => {
    setKnowledgeBase(knowledgeBase);
    setOpen(true);
  };

  const onDelete = async (knowledgeBase: KnowledgeBase) => {
    try {
      const result = await deleteKnowledgeBase(knowledgeBase._id!);
      handleToast({ result });
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    }
  };

  const memoizedColumns = React.useMemo(
    () => getColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <>
      <ControlledTable
        columns={memoizedColumns}
        data={knowledgeBases}
        pageCount={Math.ceil(pagination.count / pagination.limit)}
        sortableColumns={sortableColumns}
      />
      <KnowledgeBaseForm
        open={open}
        setOpen={setOpen}
        knowledgeBase={knowledgeBase}
      />
    </>
  );
};

export default DataTable;
