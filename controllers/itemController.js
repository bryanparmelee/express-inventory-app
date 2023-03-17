const Item = require("../models/item");
const Brand = require("../models/brand");
const Category = require("../models/category");

const async = require("async");

exports.index = (req, res, body) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback);
      },
      brand_count(callback) {
        Brand.countDocuments({}, callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Gear Wishlist Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.item_list = (req, res, next) => {
  Item.find({}, "name brand")
    .sort({ name: 1 })
    .populate("brand")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      res.render("item_list", { title: "Item List", item_list: list_items });
    });
};

exports.item_details = (req, res, next) => {
  res.send(`Item details ${req.params.id}`);
};

exports.item_create_get = (req, res, next) => {
  res.send("Item create-get");
};

exports.item_create_post = (req, res, next) => {
  res.send("Item create-post");
};

exports.item_delete_get = (req, res, next) => {
  res.send("Item delete-get");
};

exports.item_delete_post = (req, res, next) => {
  res.send("Item delete-post");
};
exports.item_update_get = (req, res, next) => {
  res.send("Item update-get");
};

exports.item_update_post = (req, res, next) => {
  res.send("Item update-post");
};
