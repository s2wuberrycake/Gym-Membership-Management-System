import {
  getMemberGrowth,
  getVisitRate,
  getMemberRatio
} from "../services/analytics.js"

export const getMemberGrowthController = async (req, res, next) => {
  try {
    const period = req.query.period || "default"
    const data = await getMemberGrowth(period)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const getVisitRateController = async (req, res, next) => {
  try {
    const period = req.query.period || "default"
    const data = await getVisitRate(period)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const getMemberRatioController = async (req, res, next) => {
  try {
    const data = await getMemberRatio()
    res.json(data)
  } catch (err) {
    next(err)
  }
}
