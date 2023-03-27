const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");

exports.category_list = (req, res, next) => {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      res.render("category_list", {
        title: "Categories",
        category_list: list_categories,
      });
    });
};

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("category_detail"),
        {
          title: "Category Detail",
          category: results.category,
          category_items: results.category_items,
        };
    }
  );
};

exports.category_create_get = (req, res, next) => {
  res.send("Category create-get");
};

exports.category_create_post = (req, res, next) => {
  res.send("Category create-post");
};

exports.category_delete_get = (req, res, next) => {
  res.send("Catogory delete-get");
};

exports.category_delete_post = (req, res, next) => {
  res.send("Category delete-post");
};

exports.category_update_get = (req, res, next) => {
  res.send("Category update-get");
};

exports.category_update_post = (req, res, next) => {
  res.send("Category update-post");
};
