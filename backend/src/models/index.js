const User = require("./User");
const Leave = require("./Leave");


User.hasMany(Leave, {
    foreignKey: "userId",
});


Leave.belongsTo(User, {
    foreignKey: "userId",
});


module.exports = {
    User,
    Leave
};