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
    console.log("DEBUG >> Incoming member payload:", req.body)
    await insertMember(req.body)
    console.log("DEBUG >> Member successfully inserted")
    res.json({ success: true, message: "Member added" })
  } catch (err) {
    next(err)
  }
}

export const updateMemberController = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(`DEBUG >> Updating member with ID: ${id}`, req.body)
    await updateMember(id, req.body)
    console.log("DEBUG >> Member update successful")
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const extendMembershipController = async (req, res, next) => {
  try {
    const { id } = req.params
    const { extend_date_id } = req.body

    console.log(`DEBUG >> Extending membership for ID: ${id} using extend_date_id: ${extend_date_id}`)

    if (!extend_date_id) {
      console.log("DEBUG >> Missing extend_date_id in request body")
      return res.status(400).json({
        success: false,
        message: "extend_date_id is required to extend membership"
      })
    }

    const result = await extendMember(id, extend_date_id)
    console.log("DEBUG >> Membership extension successful")

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
    console.log(`DEBUG >> Cancelling member with ID: ${id}`)

    await cancelMember(id)
    console.log("DEBUG >> Member successfully cancelled and archived")

    res.json({
      success: true,
      message: "Member cancelled and moved to archive"
    })
  } catch (err) {
    next(err)
  }
}