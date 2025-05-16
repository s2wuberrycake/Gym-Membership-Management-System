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
    console.log("DEBUG >> Fetching all duration options")
    const durations = await getDurations()
    res.json(durations)
  } catch (err) {
    next(err)
  }
}

// GET /api/members
export const getAllMembersController = async (req, res, next) => {
  try {
    console.log("DEBUG >> Fetching all members")
    const members = await getMembers()
    res.json(members)
  } catch (err) {
    next(err)
  }
}

// GET /api/members/:id
export const getMemberByIdController = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(`DEBUG >> Fetching member by ID: ${id}`)
    const member = await getMemberById(id)
    if (!member) {
      console.log("DEBUG >> Member not found")
      return res.status(404).json({ success: false, message: "Member not found" })
    }
    res.json(member)
  } catch (err) {
    next(err)
  }
}

// POST /api/members
export const createMemberController = async (req, res, next) => {
  try {
    const account_id = req.user.id
    console.log("DEBUG >> Creating new member", req.body)

    // 1) insert the text fields
    const member_id = await insertMember(req.body, account_id)

    // 2) if a file was uploaded, save it and update the DB
    if (req.file) {
      await saveProfilePic(member_id, req.file)
      console.log(`DEBUG >> Saved profile picture for member ${member_id}`)
    }

    res.status(201).json({ success: true, member_id })
  } catch (err) {
    next(err)
  }
}

// PUT /api/members/:id
export const updateMemberController = async (req, res, next) => {
  try {
    const { id } = req.params
    const account_id = req.user.id
    console.log(`DEBUG >> Updating member ${id}`, req.body)

    // 1) update the text fields
    await updateMember(id, req.body, account_id)

    // 2) if a new photo was uploaded, overwrite it
    if (req.file) {
      await saveProfilePic(id, req.file)
      console.log(`DEBUG >> Updated profile picture for member ${id}`)
    }

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

// PUT /api/members/:id/extend
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
    const account_id = req.user.id
    console.log(`DEBUG >> Extending membership for ${id}`)
    await extendMember(id, extend_date_id, account_id)
    console.log(`DEBUG >> Membership for ${id} extended`)
    res.json({ success: true, message: "Membership extended" })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/members/:id/cancel
export const cancelMemberController = async (req, res, next) => {
  try {
    const { id } = req.params
    const account_id = req.user.id
    console.log(`DEBUG >> Cancelling member ${id}`)
    await cancelMember(id, account_id)
    console.log(`DEBUG >> Member ${id} cancelled`)
    res.json({ success: true, message: "Member cancelled and archived" })
  } catch (err) {
    next(err)
  }
}
