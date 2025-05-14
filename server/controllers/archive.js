import {
  getCancelledMembers,
  getCancelledMemberById,
  restoreMember
} from "../services/members.js"

export const getCancelledMembersController = async (req, res, next) => {
  try {
    console.log("DEBUG >> Fetching all cancelled members")
    const cancelled = await getCancelledMembers()
    res.json(cancelled)
  } catch (err) {
    next(err)
  }
}

export const getCancelledMemberByIdController = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(`DEBUG >> Fetching cancelled member with ID: ${id}`)

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

    console.log(`DEBUG >> Restoring member with ID: ${id}, using extend_date_id: ${extend_date_id}`)

    if (!extend_date_id) {
      return res.status(400).json({ error: "extend_date_id is required to restore a member" })
    }

    await restoreMember(id, extend_date_id)
    res.json({ message: "Member restored successfully" })
  } catch (err) {
    next(err)
  }
}