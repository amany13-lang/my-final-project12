const { Leave } = require("../models");

// Create Leave
const createLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const leave = await Leave.create({
      startDate,
      endDate,
      reason,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: "Leave request created successfully",
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(leaves);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Leave By ID
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    return res.status(200).json(leave);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Leave
const updateLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    const leave = await Leave.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be updated",
      });
    }

    await leave.update({
      startDate,
      endDate,
      reason,
    });

    return res.status(200).json({
      message: "Leave updated successfully",
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Leave
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be deleted",
      });
    }

    await leave.destroy();

    return res.status(200).json({
      message: "Leave deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createLeave,
  getMyLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
};