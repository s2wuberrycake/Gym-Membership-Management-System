import React from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from "@tanstack/react-table"
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow
} from "lucide-react"
import { format } from "date-fns"
import TablePagination from "./table-pagination" // Adjust path if needed

// Default filter logic for member data
const defaultMemberFilterFn = (row, columnId, filterValue) => {
  const member = row.original
  const lower = filterValue.toLowerCase()

  const fullName = `${member.first_name} ${member.last_name}`.toLowerCase()
  const joinDate = member.join_date
    ? format(new Date(member.join_date), "MMM dd, yyyy").toLowerCase()
    : ""
  const expirationDate = member.expiration_date
    ? format(new Date(member.expiration_date), "MMM dd, yyyy").toLowerCase()
    : ""

  return (
    member.id?.toLowerCase().includes(lower) ||
    member.first_name?.toLowerCase().includes(lower) ||
    member.last_name?.toLowerCase().includes(lower) ||
    fullName.includes(lower) ||
    member.contact_number?.toLowerCase().includes(lower) ||
    member.status?.toLowerCase().includes(lower) ||
    joinDate.includes(lower) ||
    expirationDate.includes(lower)
  )
}

const DataTable = ({
  columns,
  data,
  globalFilter,
  onGlobalFilterChange,
  globalFilterFn, // <- optional override
  setTableRef // ✅ NEW
}) => {
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      globalFilter
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn || defaultMemberFilterFn
  })

  React.useEffect(() => {
    if (setTableRef) setTableRef(table)
  }, [table])

  return (
    <div className="rounded-md border">
      <table className="min-w-full text-sm">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left cursor-pointer select-none font-bold"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && (
                      <ArrowDownWideNarrow className="w-4 h-4" />
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <ArrowUpWideNarrow className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-secondary">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 border-t font-medium">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  
      <TablePagination table={table} />
    </div>
  )
}

export default DataTable
