const Category = require("../models/category");

exports.cateogry_list = (req, res, next) => {
  res.send("Category list");
};

exports.category_detail = (req, res, next) => {
  res.send(`Category detail ${req.params.id}`);
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
