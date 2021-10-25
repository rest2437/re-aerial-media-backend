require("dotenv").config();
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const router = express.Router();
const { User, Testimonial } = require("../models");

router.get("/test", (req, res) => {
  res.json({ message: "User endpoint OK! ✅" });
});
router.get("/testimonials", async (req, res) => {
  console.log("====> inside /testimonials");
  console.log("====> user", req.user);
  try {
    let { _id } = req.user;
    let currentUser = await User.findById(_id);
    let updateUser = await currentUser.populate("testimonial");
    console.log(currentUser);
    res.status(200).json({
      update: updateUser,
    });
  } catch (error) {
    console.log("router.get error", error);
    res.status(500).json({
      message: "Something went wrong. Please try again later!",
    });
  }
});
router.get(
  "/testimonials",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("====> inside /testimonials");
    console.log("====> user", req.user);
    try {
      let { _id } = req.user;
      let currentUser = await User.findById(_id);

      let updateUser = await currentUser.populate("testimonial");

      console.log(currentUser);
      res.status(200).json({
        update: updateUser,
      });
    } catch (error) {
      console.log("router.get error", error);
      res.status(500).json({
        message: "Something went wrong. Please try again later!",
      });
    }
  }
);

router.post("/signup", async (req, res) => {
  console.log("===> Inside of /signup");
  console.log(req.body);

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw Error;

          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log("==> Error inside of hash", err);
            newUser.password = hash;
            newUser
              .save()
              .then((createdUser) => res.json(createdUser))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => {
      console.log("Error finding user", err);
      res.json({ message: "An error occured. Please try again." });
    });
});

router.post("/login", async (req, res) => {
  console.log("===> Inside of /login");
  console.log(req.body);

  const foundUser = await User.findOne({ email: req.body.email });

  if (foundUser) {
    let isMatch = await bcrypt.compare(req.body.password, foundUser.password);
    console.log("Match User", isMatch);
    if (isMatch) {
      const payload = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) {
          res
            .status(400)
            .json({ message: "Session has endedd, please log in again" });
        }
        const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
        console.log("===> legit");
        console.log(legit);
        res.json({ success: true, token: `Bearer ${token}`, userData: legit });
      });
    } else {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }
  } else {
    return res.status(400).json({ message: "User not found" });
  }
});

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log("====> inside testimonial/add");
      console.log("====> user", req.user);

      let { _id } = req.user;
      let currentUser = await User.findById(_id);
      let newTestimonial = await Testimonial.create({
        name: req.body.name,
        content: req.body.content,
      });
      console.log(currentUser.testimonial);
      currentUser.testimonial.push(newTestimonial._id);
      currentUser.save();
      let updateTestimonial = await currentUser.populate("testimonial");
      console.log(currentUser);
      res.status(200).json({
        update: updateTestimonial,
      });
    } catch (error) {
      console.log("error", error);
    }
  }
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("====> inside /profile");
    console.log("====> user", req.user);
    const { id, name, email } = req.user;
    res.json({ id, name, email });
  }
);

router.get(
  "/token",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { _id } = req.user;

    try {
      const foundUser = await User.findById(_id);
      const payload = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) {
          res
            .status(400)
            .json({ message: "Session has endedd, please log in again" });
        }
        const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
        console.log("===> legit");
        console.log(legit);
        res.json({ success: true, token: `Bearer ${token}`, userData: legit });
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put("/update/:id", function (req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    function (err, response) {
      if (err) {
        res.send(err);
      } else {
        console.log(response);
        console.log("user updated!");
        res.status(200).json({ status: 200, message: "update successful" });
      }
    }
  );
});

module.exports = router;
