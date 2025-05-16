import express from "express"
import { extractUser } from "../middleware/user.js"
import { upload }      from "../middleware/upload.js"
import {
  getDurationsController,
  getAllMembersController,
  getMemberByIdController,
  createMemberController,
  updateMemberController,
  extendMembershipController,
  cancelMemberController
} from "../controllers/members.js"

const router = express.Router()

// peel off the token into req.user
router.use(extractUser)

// file‐upload + create
router.post(
  "/",
  upload.single("photo"),
  createMemberController
)

// file‐upload + full update
router.put(
  "/:id",
  upload.single("photo"),
  updateMemberController
)

// the rest stay public
router.get(   "/durations",  getDurationsController)
router.get(   "/",           getAllMembersController)
router.get(   "/:id",        getMemberByIdController)
router.put(   "/:id/extend", extendMembershipController)
router.delete("/:id/cancel", cancelMemberController)

export default router
