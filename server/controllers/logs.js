import {
  getAllUpdateLogs,
  logUpdate,
  getAllVisitLogs,
  logVisit
} from "../services/logs.js"

export const getAllUpdateLogsController = async (req, res, next) => {
  try {
    const logs = await getAllUpdateLogs()
    res.json(logs)
  } catch (err) {
    next(err)
  }
}

export const logUpdateController = async (req, res, next) => {
  try {
    const { member_id, action_id, account_id } = req.body
    await logUpdate(member_id, action_id, account_id)
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export const getAllVisitLogsController = async (req, res, next) => {
  try {
    const visits = await getAllVisitLogs()
    res.json(visits)
  } catch (err) {
    next(err)
  }
}

export const logVisitController = async (req, res, next) => {
  try {
    const { member_id } = req.body
    const visit = await logVisit(member_id)
    if (!visit) {
      return res.status(200).json({ message: "Visit already logged today" })
    }
    res.json(visit)
  } catch (err) {
    next(err)
  }
}
