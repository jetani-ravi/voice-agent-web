"use client";

import React from "react";
import { Pagination } from "@/types/api";
import { getColumns } from "./columns";
import ControlledTable from "@/components/ui/table/controlled-table";
import { PhoneNumber } from "@/app/modules/phone-numbers/interface";
import { deletePhoneNumber } from "@/app/modules/phone-numbers/action";
import { useToastHandler } from "@/hooks/use-toast-handler";

interface DataTableProps {
  phoneNumbers: PhoneNumber[];
  pagination: Pagination;
}

const DataTable = ({ phoneNumbers, pagination }: DataTableProps) => {
  const sortableColumns = [
    "properties.friendly_name",
    "purchased",
    "telephonyProvider",
    "created_at",
  ];
  const { handleToast } = useToastHandler();

  const onDelete = async (phoneNumber: PhoneNumber) => {
    try {
      const result = await deletePhoneNumber(phoneNumber._id);
      handleToast({
        result,
        successMessage: "Phone number deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting phone number:", error);
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
        data={phoneNumbers}
        pageCount={Math.ceil(pagination.count / pagination.limit)}
        sortableColumns={sortableColumns}
      />
    </>
  );
};

export default DataTable;
