import express from 'express'
import { extractUser } from '../middleware/user.js'
import {
  getDurationsController,
  getAllMembersController,
  getMemberByIdController,
  createMemberController,
  updateMemberController,
  extendMembershipController,
  cancelMemberController
} from '../controllers/members.js'

const router = express.Router()

router.use(extractUser)

router.get('/durations',         getDurationsController)
router.get('/',                  getAllMembersController)
router.post('/',                 createMemberController)
router.get('/:id',               getMemberByIdController)
router.put('/:id/extend',        extendMembershipController)
router.put('/:id',               updateMemberController)
router.delete('/:id/cancel',     cancelMemberController)

export default router
