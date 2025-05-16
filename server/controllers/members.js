import {
  getDurations,
  getMembers,
  getMemberById,
  insertMember,
  updateMember,
  extendMember,
  cancelMember
} from "../services/members.js"

export const getDurationsController = async (req, res, next) => {
  try {
    console.log("DEBUG >> Fetching all duration options")
    const durations = await getDurations()
    res.json(durations)
  } catch (err) {
    next(err)
  }
}

export const getAllMembersController = async (req, res, next) => {
  try {
    console.log("DEBUG >> Fetching all members")
    const members = await getMembers()
    res.json(members)
  } catch (err) {
    next(err)
  }
}

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

export const createMemberController = async (req, res, next) => {
  try {
    const account_id = req.user.id
    console.log("DEBUG >> Creating new member", req.body)
    const member_id = await insertMember(req.body, account_id)
    console.log(`DEBUG >> Member ${member_id} created`)
    res.status(201).json({ success: true, member_id })
  } catch (err) {
    next(err)
  }
}

export const updateMemberController = async (req, res, next) => {
  try {
    const { id } = req.params
    const account_id = req.user.id
    console.log(`DEBUG >> Updating member ${id}`, req.body)
    await updateMember(id, req.body, account_id)
    console.log(`DEBUG >> Member ${id} updated`)
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
    const account_id = req.user.id
    console.log(`DEBUG >> Extending membership for ${id}`)
    await extendMember(id, extend_date_id, account_id)
    console.log(`DEBUG >> Membership for ${id} extended`)
    res.json({ success: true, message: "Membership extended" })
  } catch (err) {
    next(err)
  }
}

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
