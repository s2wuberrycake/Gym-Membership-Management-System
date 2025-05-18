import { getMemberGrowth } from "../services/analytics.js"

export const getMemberGrowthController = async (req, res, next) => {
  try {
    const period = req.query.period || "default"
    const data = await getMemberGrowth(period)
    res.json(data)
  } catch (err) {
    next(err)
  }
}
