const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const { validateCampground } = require("../utils/CampgroundValidate");
const { isLoggedIn, isAuthor } = require("../middleware");
const {
  createNewCampgroundForm,
  editCampgroundForm,
  getAllCampgrounds,
  getCampgroundById,
  createNewCampground,
  editCampgroundById,
  deleteCampgroundById,
} = require("../controllers/campground.controller");
const multer = require('multer')
const {storage} = require('../utils/cloudinary');
const upload = multer({storage})


router
  .route("/")
  .get(catchAsync(getAllCampgrounds))
  .post(isLoggedIn, upload.array('image'), validateCampground,  catchAsync(createNewCampground));

router.get("/new", isLoggedIn, catchAsync(createNewCampgroundForm));

router
  .route("/:id")
  .get(catchAsync(getCampgroundById))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(editCampgroundById)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampgroundById));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(editCampgroundForm));

module.exports = router;
