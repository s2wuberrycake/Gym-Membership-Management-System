import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"

const columnHelper = createColumnHelper()

const formatDate = value =>
  value ? format(new Date(value), "MMM dd, yyyy") : "-"

const formatTime = value =>
  value ? format(new Date(value), "HH:mm:ss") : "-"

export const visitLogColumns = () => [
  columnHelper.accessor(
    row => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
    {
      id: "name",
      header: "Name",
      cell: info => info.getValue()
    }
  ),
  columnHelper.accessor("visit_date", {
    header: "Date",
    cell: info => formatDate(info.getValue())
  }),
  columnHelper.accessor(row => row.visit_date, {
    id: "time",
    header: "Time",
    cell: info => formatTime(info.getValue())
  }),
]
