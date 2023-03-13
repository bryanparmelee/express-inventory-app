#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require("async");
const Item = require("./models/item");
const Category = require("./models/category");
const Brand = require("./models/brand");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const items = [];
const categories = [];
const brands = [];

function brandCreate(name, website) {
  const brand = new Brand({ name: name, website: website });

  brands
    .save()
    .then(() => {
      console.log("New Brand: " + brand);
      brands.push(brand);
    })
    .catch((err) => {
      console.log(err);
    });
}

function categoryCreate(name, description) {
  categorydetail = {
    name: name,
    description: description,
  };

  const category = new Category(categorydetail);
  category
    .save()
    .then(() => {
      console.log("New Category: " + category);
      categories.push(category);
    })
    .catch((err) => {
      console.log(err);
    });
}

function itemCreate(name, description, brand, category, price, image) {
  itemdetail = {
    name: name,
    description: description,
    brand: brand,
    category: category,
    price: price,
    image: image,
  };

  if (category != false) itemdetail.category = category;

  if (brand != false) itemdetail.brand = brand;

  const item = new Item(itemdetail);

  item
    .save()
    .then(() => {
      console.log("New Item: " + item);
      items.push(item);
    })
    .catch((err) => {
      console.log(err);
    });
}

function createCategoryBrands() {
  async.series([
    function () {
      categoryCreate(
        "Synths",
        "Modular, semi-modular. Keyboards, controllers. Anything synth-related."
      );
    },
    function () {
      categoryCreate(
        "Guitars",
        "Acoustic or electric. Find all the six stringers here."
      );
    },
    function () {
      categoryCreate("Effects", "Echo, loopers, distortion, you name it.");
    },
    function () {
      categoryCreate(
        "Recording",
        "Microphones. Outboard equipment. Consoles. Studio magic."
      );
    },

    function () {
      brandCreate("Make Noise", "https://www.makenoisemusic.com/");
    },
    function () {
      brandCreate("Pittsburgh Modular", "https://pittsburghmodular.com/");
    },
    function () {
      brandCreate("Fender", "https://www.fender.com/");
    },

    function () {
      brandCreate("Gibson", "https://www.gibson.com/");
    },
    function () {
      brandCreate("Chase Bliss", "https://www.chasebliss.com/");
    },
    function () {
      brandCreate("Earthquaker Devices", "https://www.earthquakerdevices.com/");
    },
    function () {
      brandCreate("Solid State Logic", "https://www.solidstatelogic.com/");
    },
    function () {
      brandCreate("API Audio", "https://www.apiaudio.com/");
    },
  ]);
}

function createItems() {
  async.parallel([
    function () {
      itemCreate(
        "MATHS",
        "The MATHS music synthesizer module is an analog computer designed for musical purposes.",
        brands[0],
        categories[0],
        "290.00",
        "https://www.makenoisemusic.com/thumbs/modules/maths/mts2-white-dec13-1883x2388.png"
      );
    },
    function () {
      itemCreate(
        "Taiga",
        "Taiga is a complete, modern, modular instrument that allows us to explore beyond the boundaries of a traditional analog synthesizer.",
        brands[1],
        categories[0],
        "799.99",
        "https://images.squarespace-cdn.com/content/v1/56aeb9254d088e3be58a3d47/759b5cb0-e410-40e9-bc99-ab8827e322c8/Taiga+Face+Front+Black+Clean.jpg?format=2500w"
      );
    },
    function () {
      itemCreate(
        "1962 Fender Jaguar",
        "First year of Jaguar production. Alder body, Maple neck with veneer Rosewood fingerboard",
        brands[2],
        categories[1],
        "6500.00",
        "https://images.reverb.com/image/upload/s--JoJnyd0w--/a_0/f_auto,t_supersize/v1675369686/nbksmpamjplmhelderfy.jpg"
      );
    },
    function () {
      itemCreate(
        "1966 Gibson Hummingbird",
        "With a full complement of ornate cosmetic details, the Gibson Hummingbird was Gibson's second most expensive production acoustic when it premiered in 1960.",
        brands[3],
        categories[1],
        "6995.00",
        "https://images.reverb.com/image/upload/s--P8OOVYHr--/f_auto,t_supersize/v1677526208/fhtywl7ifhigltszilgb.jpg"
      );
    },
    function () {
      itemCreate(
        "Blooper",
        "The dream of blooper was to merge high-fidelity looping with creative manipulation, allowing you to steer recordings to new and extraordinary places. ",
        brands[4],
        categories[3],
        "499.00",
        "https://images.squarespace-cdn.com/content/v1/622176a9b8d15d57ffbf5700/699c5aa7-9de2-4461-9fa1-96f7b8dc8733/Blooper_Pedal_Chase+Bliss_2023.jpg?format=1500w"
      );
    },
    function () {
      itemCreate(
        "Arpanoid",
        "The Arpanoid takes whatever you play and transforms it into an adjustable ascending or descending scale.",
        brands[5],
        categories[3],
        "249.00",
        "https://images.squarespace-cdn.com/content/v1/57cebe2c03596e075fca5f24/1548953571222-KSS5T3MGPE4GR3MJ8PRZ/Arpanoid-Main.jpg?format=1000w"
      );
    },
    function () {
      itemCreate(
        "Fusion",
        "Fusion is an all-analogue 2U stereo outboard processor created for the modern hybrid studio.",
        brands[6],
        categories[4],
        "2199.99",
        "https://www.solidstatelogic.com/assets/components/phpthumbof/cache/SSL%20Fusion_Front_Colours.a2b6f1494209e96452dcb4b271c89f2b.jpg"
      );
    },
    function () {
      itemCreate(
        "2500+ Stereo Bus Compressor",
        "The API 2500+ Stereo Bus Compressor allows adjustment of sonic qualities to alter the punch and tone of the stereo mix.",
        brands[7],
        categories[4],
        "3295.00",
        "https://www.apiaudio.com/img2x/products/prod_2500PLUS_1_m.jpg"
      );
    },
  ]);
}

async.series(
  [createCategoryBrands, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Items: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
