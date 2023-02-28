require("dotenv").config();
require("express-async-errors");
const express = require("express");
const apiRoutes = require("./routes/authRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");
const { authController } = require("./controllers/authController");

const { sequelize } = require("./database/config");

//Create our Expres app
const app = express();

//Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

// API Routes
app.use("/api/v1", apiRoutes);

// Error Handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Server Setup
const port = process.env.PORT || 3000;
const run = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(
        `Server is listening on ${
          process.env.NODE_ENV === "development" ? "http://localhost:" : "PORT"
        }${port}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

run();
