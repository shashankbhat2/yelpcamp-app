const Campground = require("../models/campground");
const cloudinary = require('cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken})

const getAllCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

const createNewCampgroundForm = async (req, res) => {
  res.render("campgrounds/new");
};

const editCampgroundForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "No such campground found!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

const getCampgroundById = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "No such campground found!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/campground", { campground });
};

const createNewCampground = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const campground = new Campground({
    ...req.body.campground,
    author: req.user._id,
    images: images,
    geometry: geoData.body.features[0].geometry
  });
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

const editCampgroundById = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

const deleteCampgroundById = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};

module.exports = {
  createNewCampgroundForm,
  editCampgroundForm,
  getAllCampgrounds,
  getCampgroundById,
  createNewCampground,
  editCampgroundById,
  deleteCampgroundById,
};
