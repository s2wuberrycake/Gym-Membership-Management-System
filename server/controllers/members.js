import {
  getDurations,
  getMembers,
  getMemberById,
  insertMember,
  updateMember,
  extendMember,
  cancelMember,
  saveProfilePic
} from "../services/members.js"

// GET /api/members/durations
export const getDurationsController = async (req, res, next) => {
  try {
    const durations = await getDurations()
    res.json(durations)
  } catch (err) {
    next(err)
  }
}

// GET /api/members
export const getAllMembersController = async (req, res, next) => {
  try {
    const members = await getMembers()
    res.json(members)
  } catch (err) {
    next(err)
  }
}

// GET /api/members/:id
export const getMemberByIdController = async (req, res, next) => {
  try {
    const member = await getMemberById(req.params.id)
    if (!member) return res.status(404).json({ success: false, message: "Member not found" })
    res.json(member)
  } catch (err) {
    next(err)
  }
}

// POST /api/members
export const createMemberController = async (req, res, next) => {
  try {
    // guard if no user
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    // 1) insert the text fields
    const member_id = await insertMember(req.body, req.user.id)

    // 2) if they uploaded a file, save it now
    if (req.file) {
      await saveProfilePic(member_id, req.file)
    }

    res.status(201).json({ success: true, member_id })
  } catch (err) {
    next(err)
  }
}

// PUT /api/members/:id
export const updateMemberController = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    // 1) update text
    await updateMember(req.params.id, req.body, req.user.id)

    // 2) overwrite photo if given
    if (req.file) {
      await saveProfilePic(req.params.id, req.file)
    }

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

// PUT /api/members/:id/extend
export const extendMembershipController = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    if (!req.body.extend_date_id) {
      return res.status(400).json({ success: false, message: "extend_date_id is required" })
    }
    await extendMember(req.params.id, req.body.extend_date_id, req.user.id)
    res.json({ success: true, message: "Membership extended" })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/members/:id/cancel
export const cancelMemberController = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    await cancelMember(req.params.id, req.user.id)
    res.json({ success: true, message: "Member cancelled and archived" })
  } catch (err) {
    next(err)
  }
}
