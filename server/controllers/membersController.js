import {
  fetchDurations,
  fetchMembers,
  fetchMemberById,
  insertMember,
  editMember,
  updateMemberExpiration
} from "../services/membersService.js"

export const getDurations = async (req, res, next) => {
  try {
    const durations = await fetchDurations()
    res.json(durations)
  } catch (err) {
    next(err)
  }
}

export const getAllMembers = async (req, res, next) => {
  try {
    const members = await fetchMembers()
    res.json(members)
  } catch (err) {
    next(err)
  }
}

export const getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params
    const member = await fetchMemberById(id)

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" })
    }

    res.json(member)
  } catch (err) {
    next(err)
  }
}

export const createMember = async (req, res, next) => {
  try {
    console.log("DEBUG >> Incoming member payload:", req.body)

    await insertMember(req.body)

    console.log("DEBUG >> Member inserted")
    res.json({ success: true, message: "Member added" })
  } catch (err) {
    next(err)
  }
}

export const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params
    await editMember(id, req.body)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const extendMembership = async (req, res, next) => {
  try {
    const { id } = req.params
    const { expiration_date, status } = req.body

    if (!expiration_date || !status) {
      return res.status(400).json({
        success: false,
        message: "Expiration date and status are required"
      })
    }

    await updateMemberExpiration(id, expiration_date, status)

    res.json({
      success: true,
      message: "Membership extended",
      data: { expiration_date, status }
    })
  } catch (err) {
    next(err)
  }
}