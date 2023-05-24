const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRouter = require('./routes/admin.routes');
const jobRouter = require('./routes/job.routes');
const unstopProblemRouter = require('./routes/unstopProblem.routes');


const app = express();

const db = require("./models");

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// db.sequelize.sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   })

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.use('/uploads', express.static('uploads'),)

app.use('/api/unstopProblem', unstopProblemRouter);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});