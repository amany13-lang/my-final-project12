require("dotenv").config();

const sequelize = require("./config/database");

// Import Models & Relationships
require("./models");

const app = require("./app");

const PORT = process.env.PORT || 8000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database error:", err);
  });