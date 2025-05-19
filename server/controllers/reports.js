import ExcelJS from "exceljs"
import {
  getMemberRatio,
  getMemberGrowth,
  getVisitRate
} from "../services/analytics.js"

export const downloadAnalyticsReport = async (req, res, next) => {
  try {
    const ratioRows      = await getMemberRatio()
    const growthToday    = await getMemberGrowth("default")
    const growthWeek     = await getMemberGrowth("week")
    const growthYear     = await getMemberGrowth("year")
    const visitTodayRows = await getVisitRate("default")
    const visitWeekRows  = await getVisitRate("week")
    const visitYearRows  = await getVisitRate("year")

    const totalMembers     = ratioRows.reduce((sum, r) => sum + Number(r.value), 0)
    const activeMembers    = ratioRows.find(r => r.status_id === 1)?.value ?? 0
    const expiredMembers   = ratioRows.find(r => r.status_id === 2)?.value ?? 0
    const cancelledMembers = ratioRows.find(r => r.status_id === 3)?.value ?? 0

    const sumBy = (rows, key) =>
      rows.reduce((sum, r) => sum + Number(r[key] ?? 0), 0)

    const enrolledToday  = sumBy(growthToday,  "enrolled")
    const cancelledToday = sumBy(growthToday,  "cancelled")
    const enrolledWeek   = sumBy(growthWeek,   "enrolled")
    const cancelledWeek  = sumBy(growthWeek,   "cancelled")
    const enrolledYear   = sumBy(growthYear,   "enrolled")
    const cancelledYear  = sumBy(growthYear,   "cancelled")

    const sumVisits = rows =>
      rows.reduce((sum, r) => sum + Number(r.visits ?? 0), 0)

    const visitsToday = sumVisits(visitTodayRows)
    const visitsWeek  = sumVisits(visitWeekRows)
    const visitsYear  = sumVisits(visitYearRows)

    const workbook = new ExcelJS.Workbook()
    const sheet    = workbook.addWorksheet("Analytics Report")

    sheet.columns = [
      { header: "", key: "c1", width: 20 },
      { header: "", key: "c2", width: 15 },
      { header: "", key: "c3", width: 15 }
    ]

    sheet.addRow(["Bodimetrix Fitness Gym"])
    sheet.addRow(["Manual Analytics Report"])
    sheet.addRow(["Report Date", new Date().toLocaleDateString()])
    sheet.addRow([])

    sheet.addRow(["Membership Ratio"])
    sheet.addRow(["Total Members", totalMembers])
    sheet.addRow(["Active Members", activeMembers])
    sheet.addRow(["Expired Members", expiredMembers])
    sheet.addRow(["Cancelled Members", cancelledMembers])
    sheet.addRow([])

    sheet.addRow(["Membership Growth"])
    sheet.addRow(["", "Enrolled", "Cancelled"])
    sheet.addRow(["Today", enrolledToday, cancelledToday])
    sheet.addRow(["Last Week", enrolledWeek, cancelledWeek])
    sheet.addRow(["Last Year", enrolledYear, cancelledYear])
    sheet.addRow([])

    sheet.addRow(["Visit Rate"])
    sheet.addRow(["", "Visits"])
    sheet.addRow(["Today", visitsToday])
    sheet.addRow(["Last Week", visitsWeek])
    sheet.addRow(["Last Year", visitsYear])

    sheet.getRow(1).font  = { bold: true, size: 16 }
    sheet.getRow(2).font  = { bold: true, size: 14 }
    sheet.getRow(3).font  = { italic: true }
    sheet.getRow(5).font  = { bold: true }
    sheet.getRow(11).font = { bold: true }
    sheet.getRow(12).font = { bold: true }
    sheet.getRow(17).font = { bold: true }
    sheet.getRow(18).font = { bold: true }

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=\"analytics-report.xlsx\""
    )
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    next(err)
  }
}
