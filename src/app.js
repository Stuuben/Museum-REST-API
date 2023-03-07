require("dotenv").config();
require("express-async-errors");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const xss = require("xss-clean");
const apiRoutes = require("./routes/authRoutes");
const cityRoutes = require("./routes/cityRoutes");
const userRoutes = require("./routes/userRoutes");
const museumRoutes = require("./routes/museumRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const {
  NotFoundMiddleware,
  notFoundMiddleware,
} = require("./middleware/notFoundMiddleware");
const { authController } = require("./controllers/authController");

const { sequelize } = require("./database/config");
//const { default: helmet } = require("helmet");

//Create our Expres app
const app = express();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(xss());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

// API Routes
app.use("/api/v1", apiRoutes);
app.use("/api/v1", cityRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", museumRoutes);
app.use("/api/v1", reviewRoutes);

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
