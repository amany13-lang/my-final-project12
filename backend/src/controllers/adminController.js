const { Leave, User } = require("../models");

// Get All Leave Requests
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(leaves);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Approve Leave
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    leave.status = "approved";
    await leave.save();

    return res.status(200).json({
      message: "Leave approved successfully",
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Reject Leave
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    leave.status = "rejected";
    await leave.save();

    return res.status(200).json({
      message: "Leave rejected successfully",
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllLeaves,
  approveLeave,
  rejectLeave,
};