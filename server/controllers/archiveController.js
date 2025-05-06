import {
  getCancelledMembers,
  getCancelledMemberById,
  restoreMember
} from "../services/membersService.js"

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
      return res.status(404).json({ error: "Cancelled member not found" })
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
      return res.status(400).json({ error: "extend_date_id is required to restore a member" })
    }
    
    await restoreMember(id, extend_date_id)
    res.json({ message: "Member restored successfully" })
  } catch (err) {
    next(err)
  }
}