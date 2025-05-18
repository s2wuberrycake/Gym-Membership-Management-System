import {
  getMemberGrowth,
  getVisitRate,
  getMemberRatio,
  getDashboardStats,
  getMostRecentVisit
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

export const getDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await getDashboardStats()
    res.json(stats)
  } catch (err) {
    next(err)
  }
}

export const getMostRecentVisitController = async (req, res, next) => {
  try {
    const visit = await getMostRecentVisit()
    res.json(visit)
  } catch (err) {
    next(err)
  }
}