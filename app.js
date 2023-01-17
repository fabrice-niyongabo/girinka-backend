require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use(cors());

//home route
app.get("/", (req, res) => {
  res.send(`
  <h1>Girinka REST APIs</h1>
  `);
});

const usersRoute = require("./routes/users");
const cowsRoute = require("./routes/cows");
const sectorRoute = require("./routes/sector");
const cellRoute = require("./routes/cell");
const candidatesRoute = require("./routes/candidates");
const reportsRoute = require("./routes/reports");
const announcementsRoute = require("./routes/announcements");
app.use("/api/users/", usersRoute);
app.use("/api/cows/", cowsRoute);
app.use("/api/sector/", sectorRoute);
app.use("/api/cell/", cellRoute);
app.use("/api/candidates/", candidatesRoute);
app.use("/api/reports/", reportsRoute);
app.use("/api/announcements/", announcementsRoute);

//404 route
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "The page does not exist on the server.",
    },
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
