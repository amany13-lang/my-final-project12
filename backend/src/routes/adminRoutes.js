const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllLeaves,
  approveLeave,
  rejectLeave,
} = require("../controllers/adminController");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/leaves", getAllLeaves);

router.put("/leaves/:id/approve", approveLeave);

router.put("/leaves/:id/reject", rejectLeave);

module.exports = router;