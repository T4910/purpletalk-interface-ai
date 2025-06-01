"use client"

import { memo } from "react"
import { ArrowUpDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Column } from "@tanstack/react-table"
import type { Property } from "@/lib/store/table-store"

interface TableColumnHeaderProps {
  column: Column<Property, unknown>
  title: string
  className?: string
}

const TableColumnHeader = memo(function TableColumnHeader({ column, title, className = "" }: TableColumnHeaderProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={`h-auto p-0 font-medium text-slate-300 hover:text-white ${className}`}
    >
      {title}
      <ArrowUpDownIcon className="ml-2 h-4 w-4" />
    </Button>
  )
})

export default TableColumnHeader
