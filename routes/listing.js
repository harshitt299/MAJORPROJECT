const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/WrapAsync.js");
const Listing=require("../models/listing.js");
const listingontroller = require("../controllers/listing.js");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });





router
 .route("/")
 .get(wrapAsync(listingontroller.index))
.post(isLoggedin, upload.single("listing[image]"), validateListing,  wrapAsync(listingontroller.createListing));



router.get("/new", isLoggedin, listingontroller.renderNewForm );

router
 .route("/:id")
 .get(wrapAsync(listingontroller.showListing))
 .put( isLoggedin, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingontroller.UpdateListing))
 .delete(isLoggedin, isOwner, wrapAsync(listingontroller.destroylisting));


//  Edit  Route
router.get("/:id/edit",isLoggedin, isOwner, wrapAsync(listingontroller.renderEditForm));
 

   module.exports = router;