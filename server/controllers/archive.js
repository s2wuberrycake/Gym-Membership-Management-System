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
    console.log(`DEBUG >> Fetching cancelled member by ID: ${id}`)
    const member = await getCancelledMemberById(id)
    if (!member) {
      console.log("DEBUG >> Cancelled member not found")
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
      return res.status(400).json({
        success: false,
        message: "extend_date_id is required to restore a member"
      })
    }
    const account_id = req.user.id
    console.log(`DEBUG >> Restoring member ${id}`)
    await restoreMember(id, extend_date_id, account_id)
    console.log(`DEBUG >> Member ${id} restored`)
    res.json({ success: true, message: "Member restored successfully" })
  } catch (err) {
    next(err)
  }
}
