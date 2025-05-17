const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
//index route
//cfreate route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);
//show route
//update
//Delete
router.route("/:id")
        .get(wrapAsync( listingController.showListing))
        .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
        .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.renderEditForm));
module.exports=router;
