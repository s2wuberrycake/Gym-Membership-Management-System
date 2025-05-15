import React, { useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const PAGE_SIZE_KEY = "tablePageSize"

const TablePagination = ({ table }) => {
  // On first mount, read page size from localStorage
  useEffect(() => {
    const savedPageSize = localStorage.getItem(PAGE_SIZE_KEY)
    if (savedPageSize) {
      table.setPageSize(Number(savedPageSize))
    } else {
      table.setPageSize(10) // default
    }
  }, [table])

  const handlePageSizeChange = value => {
    localStorage.setItem(PAGE_SIZE_KEY, value)
    table.setPageSize(Number(value))
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground pl-2">
        Total Rows: {table.getFilteredRowModel().rows.length} · Shown:{" "}
        {table.getRowModel().rows.length}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top" sideOffset={4}>
              {[10, 20, 30, 50, 100].map(size => (
                <SelectItem key={size} value={`${size}`}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        {/* Pill‐style nav group */}
        <div className="inline-flex items-center rounded-md border bg-muted h-9">
          <Button
            variant="ghost"
            className="hidden h-9 w-9 p-0 lg:flex rounded-l-md"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="hidden h-9 w-9 p-0 lg:flex rounded-r-md"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TablePagination
