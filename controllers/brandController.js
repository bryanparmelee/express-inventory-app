const Brand = require("../models/brand");
const Item = require("../models/item");

const async = require("async");

const { body, validationResult } = require("express-validator");

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
  async.parallel(
    {
      brand(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_items(callback) {
        Item.find({ brand: req.params.id }, "name").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.brand == null) {
        const err = new Error("Brand not found");
        err.status = 404;
        return next(err);
      }
      res.render("brand_detail", {
        title: "Brand Detail",
        brand: results.brand,
        brand_items: results.brand_items,
      });
    }
  );
};

exports.brand_create_get = (req, res, next) => {
  res.render("brand_form", { title: "Create Brand" });
};

exports.brand_create_post = [
  body("brand_name", "Brand name required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand_url", "Website required").trim().isURL(),
  (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({
      name: req.body.brand_name,
      website: req.body.brand_url,
    });

    if (!errors.isEmpty()) {
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      Brand.findOne({ name: req.body.brand_name }).exec((err, found_brand) => {
        if (err) {
          return next(err);
        }
        if (found_brand) {
          res.redirect(found_brand.url);
        } else {
          brand.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

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
