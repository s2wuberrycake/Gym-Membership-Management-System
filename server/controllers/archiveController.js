import { fetchCancelledMembers, fetchCancelledMemberById, restoreMember } from "../services/membersService.js"

export const getCancelledMembers = async (req, res, next) => {
  try {
    const cancelled = await fetchCancelledMembers()
    res.json(cancelled)
  } catch (err) {
    next(err)
  }
}

export const getCancelledMemberById = async (req, res, next) => {
  try {
    const { id } = req.params
    const member = await fetchCancelledMemberById(id)

    if (!member) {
      return res.status(404).json({ error: "Cancelled member not found" })
    }

    res.json(member)
  } catch (err) {
    next(err)
  }
}

export const restoreCancelledMember = async (req, res, next) => {
  try {
    const { id } = req.params
    const { expiration_date } = req.body

    if (!expiration_date) {
      return res.status(400).json({ error: "Expiration date is required to restore a member" })
    }

    await restoreMember(id, expiration_date)
    res.json({ message: "Member restored successfully" })
  } catch (err) {
    next(err)
  }
}
