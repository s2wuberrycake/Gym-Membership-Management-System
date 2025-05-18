import axios from "axios"
import { UPDATES_API, VISITS_API } from "."

export const getAllUpdateLogs = async () => {
  const res = await axios.get(UPDATES_API)
  return res.data
}

export const logUpdate = async (memberId, actionId, accountId) => {
  await axios.post(UPDATES_API, {
    member_id:  memberId,
    action_id:  actionId,
    account_id: accountId
  })
}

export const getAllVisitLogs = async () => {
  const res = await axios.get(VISITS_API)
  return res.data
}

export const logVisit = async memberId => {
  try {
    const res = await axios.post(VISITS_API, { member_id: memberId })
    return res.data
  } catch (err) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message)
    }
    throw err
  }
}
