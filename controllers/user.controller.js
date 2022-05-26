const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

const getUserRegisterPage = (req, res) => {
  res.render("users/register");
};

const getUserLoginPage = (req, res) => {
  res.render("users/login");
};

const loginUser = (req, res) => {
  req.flash("success", `Welcome back! ${req.user.username}`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
};

module.exports = {
  getUserRegisterPage,
  getUserLoginPage,
  registerUser,
  loginUser,
  logoutUser
};
