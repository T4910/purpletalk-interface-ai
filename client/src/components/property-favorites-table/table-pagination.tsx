"use client";

import { memo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/lib/store/table-store";

interface TablePaginationProps {
  totalRows: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

const TablePagination = memo(function TablePagination({
  totalRows,
  canPreviousPage,
  canNextPage,
}: TablePaginationProps) {
  const pageIndex = useTableStore((state) => state.pageIndex);
  const pageSize = useTableStore((state) => state.pageSize);
  const setPageIndex = useTableStore((state) => state.setPageIndex);
  const selectedRowIds = useTableStore((state) => state.selectedRowIds);

  const selectedCount = Object.keys(selectedRowIds).length;
  const hasSelectedRows = selectedCount > 0;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = Math.ceil(totalRows / pageSize);

  return (
    <div className="p-4 border-t   flex items-center justify-between flex-wrap">
      <div className="text-sm text-slate-400">
        {hasSelectedRows
          ? `${selectedCount} of ${totalRows} row(s) selected.`
          : `Showing ${startRow} to ${endRow} of ${totalRows} properties.`}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={!canPreviousPage}
          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
        >
          <ChevronLeftIcon size={16} className="mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-1 text-sm text-slate-400">
          Page {pageIndex + 1} of {pageCount}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={!canNextPage}
          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
        >
          Next
          <ChevronRightIcon size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
});

export default TablePagination;
