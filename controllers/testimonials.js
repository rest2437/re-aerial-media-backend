const express = require("express");
const router = express();
const mongoose = require("mongoose");

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

// router.get('/adopted', async (req, res) => {
// 	try {
// 		let allData = await mongoose.model('Adopt').find({})
// 		res.status(200).json({
// 			adopted: allData
// 		})
// 	} catch (error) {
// 		console.log('ooooops, error', error)
// 		res.status(500).json({
// 			message: 'Something went wrong. Please try again later!'
// 		})
// 	}
// })

module.exports = router;
