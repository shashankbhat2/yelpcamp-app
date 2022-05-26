const Review = require("../models/review");
const Campground = require("../models/campground");

const deleteReviewById = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully Removed Review!");
  res.redirect(`/campgrounds/${id}`);
};

const postNewReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log(req.body.review);
    const review = new Review({...req.body.review, author: req.user._id});
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review!');
    res.redirect(`/campgrounds/${campground._id}`);
  } 

module.exports = {
  deleteReviewById,
  postNewReview
};
