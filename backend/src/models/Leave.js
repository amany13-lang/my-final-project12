const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Leave = sequelize.define("Leave", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

});

Leave.associate = (models) => {
  Leave.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};


module.exports = Leave;