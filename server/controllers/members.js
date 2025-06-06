import {
  getDurations,
  getMembers,
  getMemberById,
  getMemberByRFID,
  insertMember,
  updateMember,
  extendMember,
  cancelMember,
} from "../services/members.js"
import {
  saveProfilePic,
  restoreProfilePic
} from "../services/files.js"

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
    if (req.query.rfid) {
      const member = await getMemberByRFID(req.query.rfid)
      if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" })
      }
      return res.json(member)
    }
    const member = await getMemberById(req.params.id)
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
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    const member_id = await insertMember(req.body, req.user.id)
    if (req.file) {
      await saveProfilePic(member_id, req.file)
    }
    res.status(201).json({ success: true, member_id })
  } catch (err) {
    next(err)
  }
}

export const updateMemberController = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    const updatedMember = await updateMember(
      req.params.id,
      req.body,
      req.user.id
    )
    if (req.file) {
      await saveProfilePic(req.params.id, req.file)
    } else if (req.body.existingPhoto) {
      await restoreProfilePic(req.params.id, req.body.existingPhoto)
    }
    res.json({ success: true, member: updatedMember })
  } catch (err) {
    next(err)
  }
}

export const extendMembershipController = async (req, res, next) => {
  try {
    console.log("DEBUG >> extendMembershipController params.id:", req.params.id)
    console.log("DEBUG >> extendMembershipController body:", req.body)
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    if (!req.body.extend_date_id) {
      return res.status(400).json({ success: false, message: "extend_date_id is required" })
    }
    const { memberId, newExpiration } = await extendMember(
      req.params.id,
      req.body.extend_date_id,
      req.user.id
    )
    res.json({ success: true, memberId, newExpiration })
  } catch (err) {
    next(err)
  }
}

export const cancelMemberController = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    const { memberId } = await cancelMember(req.params.id, req.user.id)
    res.json({ success: true, memberId })
  } catch (err) {
    next(err)
  }
}
