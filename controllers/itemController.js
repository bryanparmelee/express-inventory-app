const Item = require("../models/item");
const Brand = require("../models/brand");
const Category = require("../models/category");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

const { body, validationResult } = require("express-validator");

const async = require("async");

exports.index = (req, res, next) => {
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
        title: "Welcome to my Gear Wishlist.",
        error: err,
        data: results,
      });
    }
  );
};

exports.item_list = (req, res, next) => {
  Item.find({}, "name brand image")
    .sort({ name: 1 })
    .populate("brand")
    .populate("image")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      res.render("item_list", { title: "Gear List", item_list: list_items });
    });
};

exports.item_details = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id)
          .populate("category")
          .populate("brand")
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_detail", {
        title: "Item Detail",
        item: results.item,
      });
    }
  );
};

exports.item_create_get = (req, res, next) => {
  async.parallel(
    {
      brands(callback) {
        Brand.find(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("item_form", {
        title: "Create Item",
        brands: results.brands,
        categories: results.categories,
      });
    }
  );
};

exports.item_create_post = [
  upload.single("image"),
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  body("name", "Item name is required.").trim().isLength({ min: 1 }).escape(),
  body("description", "Item description is required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Brand name is required.").trim().isLength({ min: 1 }).escape(),
  body("category.*").escape(),
  body("price", "Item price required.").trim().isLength({ min: 1 }),
  // body("image").trim().isURL(),

  (req, res, next) => {
    const errors = validationResult(req);

    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
    });

    if (req.file !== undefined) {
      item.image = req.file.filename;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands(callback) {
            Brand.find(callback);
          },
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          for (const category of results.categories) {
            if (item.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          res.render("item_form", {
            title: "Create Item",
            brands: results.brands,
            categories: results.categories,
            item,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    item.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];

exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec((err, item) => {
      if (err) {
        return next(err);
      }
      if (item == null) {
        res.redirect("/catalog/items");
      }
      res.render("item_delete", {
        title: "Delete Item",
        item: item,
      });
    });
};

exports.item_delete_post = (req, res, next) => {
  Item.findByIdAndRemove(req.body.itemid, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/items");
  });
};

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id)
          .populate("brand")
          .populate("category")
          .exec(callback);
      },
      brands(callback) {
        Brand.find(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      for (const category of results.categories) {
        for (const itemCategory of results.item.category) {
          if (category._id.toString() === itemCategory._id.toString()) {
            category.checked = "true";
          }
        }
      }
      res.render("item_form", {
        title: "Edit Item",
        brands: results.brands,
        categories: results.categories,
        item: results.item,
      });
    }
  );
};

exports.item_update_post = [
  upload.single("image"),
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  body("name", "Item name is required.").trim().isLength({ min: 1 }).escape(),
  body("description", "Item description is required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Brand name is required.").trim().isLength({ min: 1 }).escape(),
  body("category.*").escape(),
  body("price", "Item price required.").trim().isLength({ min: 1 }),
  // body("image").trim().isURL(),
  (req, res, next) => {
    const errors = validationResult(req);

    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      category:
        typeof req.body.category === "undefined" ? [] : req.body.category,
      price: req.body.price,
      _id: req.params.id,
    });

    if (req.file !== undefined) {
      item.image = req.file.filename;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brand(callback) {
            Brand.find(callback);
          },
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          for (const category of results.categories) {
            if (item.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          res.render("item_form", {
            title: "Edit Item",
            brand: results.brand,
            categories: results.categories,
            item,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
      if (err) {
        return next(err);
      }
      res.redirect(theitem.url);
    });
  },
];
