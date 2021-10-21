const express = require("express");
const router = express();
const mongoose = require("mongoose");
const { Testimonial } = require("../models");

router.get("/", async (req, res) => {
  try {
    let allData = await mongoose.model("Testimonial").find({});
    res.status(200).json({
      testimonials: allData,
    });
  } catch (error) {
    console.log("ooooops, error", error);
    res.status(500).json({
      message: "Something went wrong!! Please try again.",
    });
  }
});

router.delete("/delete/:id", (req, res, next) => {
  Testimonial.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

module.exports = router;
