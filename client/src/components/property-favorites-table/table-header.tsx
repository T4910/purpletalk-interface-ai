import { memo } from "react";
import { SearchIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTableStore } from "@/lib/store/table-store";

interface TableHeaderProps {
  onDeleteSelected: () => void;
  totalRows: number;
}

const TableHeader = memo(function TableHeader({
  onDeleteSelected,
  totalRows,
}: TableHeaderProps) {
  const globalFilter = useTableStore((state) => state.globalFilter);
  const setGlobalFilter = useTableStore((state) => state.setGlobalFilter);
  const selectedRowIds = useTableStore((state) => state.selectedRowIds);

  const selectedCount = Object.keys(selectedRowIds).length;
  const hasSelectedRows = selectedCount > 0;

  return (
    <div className="p-4 border-b   flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          size={16}
        />
        <Input
          placeholder="Filter properties..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-10 bg-white/10 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
        />
      </div>

      {hasSelectedRows && (
        <Button
          onClick={onDeleteSelected}
          variant="destructive"
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <TrashIcon size={16} className="mr-2" />
          Delete ({selectedCount})
        </Button>
      )}
    </div>
  );
});

export default TableHeader;
