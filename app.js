/** Express app for GardenGood */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const plantRoutes = require("./routes/plants");
const cropRoutes = require("./routes/crops");
const bedRoutes = require("./routes/beds");
const gardenRoutes = require("./routes/gardens");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// app.use(/**route name */)
app.use("/auth", authRoutes);
app.use("/plants", plantRoutes);
app.use("/crops", cropRoutes);
app.use("/beds", bedRoutes);
app.use("/gardens", gardenRoutes);
app.use("/users", userRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
