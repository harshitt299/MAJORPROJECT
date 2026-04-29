const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync= require("../utils/WrapAsync.js");
const Listing=require("../models/listing.js");
const Review =require("../models/reviews.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


 


// Routes


   // create Review   route
  router.post("/", isLoggedin, validateReview,wrapAsync(reviewController.createReview));  

  // Delete Review route

  router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(reviewController.detroyReview));

module.exports = router;