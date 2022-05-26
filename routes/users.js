const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const passport = require("passport");
const {
  getUserRegisterPage,
  getUserLoginPage,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller");

router
  .route("/register")
  .get(getUserRegisterPage)
  .post(catchAsync(registerUser));

router
  .route("/login")
  .get(getUserLoginPage)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    loginUser
  );

router.get("/logout", logoutUser);

module.exports = router;
