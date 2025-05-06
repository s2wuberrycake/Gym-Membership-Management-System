import {
  getDurations,
  getMembers,
  getMemberById,
  insertMember,
  updateMember,
  extendMember,
  cancelMember
} from "../services/membersService.js"

export const getDurationsController = async (req, res, next) => {
  try {
    const durations = await getDurations()
    res.json(durations)
  } catch (err) {
    next(err)
  }
}

export const getAllMembersController = async (req, res, next) => {
  try {
    const members = await getMembers()
    res.json(members)
  } catch (err) {
    next(err)
  }
}

export const getMemberByIdController = async (req, res, next) => {
  try {
    const { id } = req.params
    const member = await getMemberById(id)

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" })
    }

    res.json(member)
  } catch (err) {
    next(err)
  }
}

export const createMemberController = async (req, res, next) => {
  try {
    console.log("DEBUG >> Incoming member payload:", req.body)
    await insertMember(req.body)

    res.json({ success: true, message: "Member added" })
  } catch (err) {
    next(err)
  }
}

export const updateMemberController = async (req, res, next) => {
  try {
    const { id } = req.params
    await updateMember(id, req.body)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const extendMembershipController = async (req, res, next) => {
  try {
    const { id } = req.params
    const { extend_date_id } = req.body

    if (!extend_date_id) {
      return res.status(400).json({
        success: false,
        message: "extend_date_id is required to extend membership"
      })
    }

    const result = await extendMember(id, extend_date_id)

    res.json({
      success: true,
      message: "Membership extended",
      data: result
    })
  } catch (err) {
    next(err)
  }
}

export const cancelMemberController = async (req, res, next) => {
  try {
    const { id } = req.params

    await cancelMember(id)

    res.json({
      success: true,
      message: "Member cancelled and moved to archive"
    })
  } catch (err) {
    next(err)
  }
}