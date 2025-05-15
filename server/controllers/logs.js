import { getAllUpdateLogs } from "../services/logs.js"

export const getAllUpdateLogsController = async (req, res, next) => {
  try {
    const logs = await getAllUpdateLogs()
    res.json(logs)
  } catch (err) {
    next(err)
  }
}
