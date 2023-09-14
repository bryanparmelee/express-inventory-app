const User = require("../models/user");

const async = require("async");
const bcrypt = require("bcryptjs");

const { body, validationResult } = require("express-validator");

exports.user_create_get = (req, res, next) => {
  res.render("signup_form", {
    title: "Create User",
  });
};
exports.user_create_post = [
  body("email", "Email required").trim().isEmail(),
  body("password", "Password Required").trim().isLength({ min: 1 }),
  body("confirm_password", "Please confirm password")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passowrds must match"),
  (req, res, next) => {
    const errors = validationResult(req);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      password: hash,
    });

    if (!errors.isEmpty()) {
      res.render("signup_form", {
        title: "Create User",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      User.findOne({ email: req.body.email }).exec((err, found_email) => {
        if (err) {
          return next(err);
        }
        if (found_email) {
          res.render("signup_form", {
            title: "Create User",
            use: user,
            errors: ["Email is already in use."],
          });
        } else {
          user.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect("item_list");
          });
        }
      });
    }
  },
];
