import { fetchCancelledMembers } from "../services/membersService.js"

export const getCancelledMembers = async (req, res, next) => {
  try {
    const cancelled = await fetchCancelledMembers()
    res.json(cancelled)
  } catch (err) {
    next(err)
  }
}
