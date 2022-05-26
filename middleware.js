const Campground = require("./models/campground");
const Review = require("./models/review");


const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

const isAuthor = async(req, res, next) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
    req.flash('error', 'Unauthorized!')
    return res.redirect(`/campgrounds/${id}`);
  }
  next()
}

const isReviewAuthor = async(req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);
  console.log(req.user)
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'Unauthorized!')
    return res.redirect(`/campgrounds/${id}`);
  }
  next()
}

module.exports = {
  isLoggedIn,
  isAuthor, 
  isReviewAuthor
}