import {
  getCancelledMembers,
  getCancelledMemberById,
  restoreMember
} from "../services/members.js"

export const getCancelledMembersController = async (req, res, next) => {
  try {
    const cancelled = await getCancelledMembers()
    res.json(cancelled)
  } catch (err) {
    next(err)
  }
}

export const getCancelledMemberByIdController = async (req, res, next) => {
  try {
    const { id } = req.params
    const member = await getCancelledMemberById(id)
    if (!member) {
      return res.status(404).json({ success: false, message: "Cancelled member not found" })
    }
    res.json(member)
  } catch (err) {
    next(err)
  }
}

export const restoreCancelledMemberController = async (req, res, next) => {
  try {
    const { id } = req.params
    const { extend_date_id } = req.body

    if (!extend_date_id) {
      return res.status(400).json({ success: false, message: "extend_date_id is required" })
    }

    const account_id = req.user?.id
    const memberId = await restoreMember(id, extend_date_id, account_id)

    res.json({ success: true, memberId })
  } catch (err) {
    next(err)
  }
}
