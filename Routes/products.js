let express = require("express");
let Router = express.Router();
let productsDB = require("../DB/productsSchema");
let Joi = require("@hapi/joi");
let auth = require("../Middlewares/userAuth");
let admin = require("../Middlewares/isAdmin");
// Routes

// All products
Router.get("/AllProducts", async (req, res) => {
  try {
    let allProducts = await productsDB.find();
    res.send(allProducts);
  } catch (ex) {
    res.send(ex.message);
  }
});

// All products by id
Router.get("/AllProducts/:id", async (req, res) => {
  try {
    let allProdsById = await productsDB.findById(req.params.id);
    if (!allProdsById) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.send(allProdsById);
  } catch (ex) {
    res.send(ex.message);
  }
});

// Add products

Router.post("/AddProduct", async (req, res) => {
  try {
    let { error } = ValidationError(req.body);
    if (error) {
      return res.status(403).send(error.details[0].message);
    }
    let existingProduct = await productsDB.findOne({ id: req.body.id });
    if (existingProduct) {
      return res.status(403).send({ message: "Product alredy exists" });
    }
    let data = new productsDB({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      offerPrice: req.body.offerPrice,
      isAvailable: req.body.isAvailable,
      isTodayOffer: req.body.isTodayOffer,
      category: req.body.category,
      recordDate: Date.now(),
      updatedDate: Date.now()
    });
    let result = await data.save();
    res.send({ message: "Product Added successfully", data: result });
  } catch (ex) {
    res.send(ex.message);
  }
});

// Update product by id

Router.put("/updateProduct/:id", async (req, res) => {
  try {
    let updateProd = await productsDB.findByIdAndUpdate(req.params.id);
    if (!updateProd) {
      return res.status(404).send({ message: " Product not found" });
    }
    let { error } = ValidationError(req.body);
    if (error) {
      return res.status(403).send(error.details[0].message);
    }
    // add data to be updated below
    //
    //
    let data = await updateProd.save();
    res.send({ message: "product updated successfully", data: data });
  } catch (ex) {
    res.send(ex.message);
  }
});

// Delete product by id

Router.delete("/deleteProducts/:id", [auth, admin], async (req, res) => {
  try {
    let deleteProductsById = await productsDB.findByIdAndDelete(req.params.id);
    if (!deleteProductsById) {
      return res.status(404).send("Product not found!");
    }
    res.send({ message: " Product deleted successfully!" });
  } catch (ex) {
    res.send(ex.message);
  }
});

function ValidationError(error) {
  let Schema = Joi.object({
    name: Joi.string().max(20),
    description: Joi.string(),
    quantity: Joi.number(),
    price: Joi.number(),
    offerPrice: Joi.number(),
    isAvailable: Joi.boolean(),
    isTodayOffer: Joi.boolean(),
    category: Joi.string(),
    isAdmin: Joi.boolean(),
    recordDate: Joi.date(),
    updatedDate: Joi.date()
  });
  return Schema.validate();
}

module.exports = Router;
