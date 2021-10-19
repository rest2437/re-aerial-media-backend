require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
require("./config/passport")(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// import models

// routes & controllers
app.get("/", (req, res) => {
  res.json({
    name: "Template",
    message: "Welcome Home",
  });
});

app.use("/users", require("./controllers/users"));

const PORT = process.env.PORT || 8000;

// listen to port
app.listen(PORT, () => console.log(`Listening on PORT`, PORT));
