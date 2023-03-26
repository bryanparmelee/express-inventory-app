const Brand = require("../models/brand");

exports.brand_list = (req, res, next) => {
  Brand.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_brands) {
      if (err) {
        return next(err);
      }
      res.render("brand_list", {
        title: "Brands",
        brand_list: list_brands,
      });
    });
};

exports.brand_detail = (req, res, next) => {
  res.send(`Brand details ${req.params.id}`);
};

exports.brand_create_get = (req, res, next) => {
  res.send("Brand create-get, not implemented");
};

exports.brand_create_post = (req, res, next) => {
  res.send("Brande create-post");
};

exports.brand_delete_get = (req, res, next) => {
  res.send("Brand delete-get");
};

exports.brand_delete_post = (req, res, nest) => {
  res.send("Brand delete-post");
};

exports.brand_update_get = (req, res, next) => {
  res.send("Brand update-get");
};

exports.brand_update_post = (req, res, next) => {
  res.send("Brand update-post");
};
