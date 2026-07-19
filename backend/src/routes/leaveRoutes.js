const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createLeave,
  getMyLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
} = require("../controllers/leaveController");

router.post("/", authMiddleware, createLeave);

router.get("/", authMiddleware, getMyLeaves);

router.get("/:id", authMiddleware, getLeaveById);

router.put("/:id", authMiddleware, updateLeave);

router.delete("/:id", authMiddleware, deleteLeave);

module.exports = router;