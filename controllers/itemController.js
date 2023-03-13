const Item = require("../models/item");

exports.index = (req, res, body) => {
  res.send("Home page");
};

exports.item_list = (req, res, next) => {
  res.send("Item list");
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
