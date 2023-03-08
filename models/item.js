const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  category: [{ type: Schema.Types.ObjectId, ref: "Cateogry" }],
});

ItemSchema.virtual("url").get(function () {
  return `/items/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
