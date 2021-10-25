require("dotenv").config();
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const cors = require("cors");
const passport = require("passport");
const nodemailer = require("nodemailer");
const router = express.Router();
require("./config/passport")(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use(passport.initialize());
app.use(methodOverride("_method"));
app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Reaerialmedia1@gmail.com",
    pass: "Rest2437",
  },
});

contactEmail.verify((error) => {
  if (("error", error)) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

app.get("/", (req, res) => {
  res.json({
    name: "Template",
    message: "Welcome Home",
  });
});
router.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: "Reaerialmedia1@gmail.com",
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

app.use("/users", require("./controllers/users"));
app.use("/testimonials", require("./controllers/testimonials"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Listening on PORT`, PORT));
