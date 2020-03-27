let express = require("express");
let Router = express.Router();
let productsDB = require("../DB/productsSchema");
let Joi = require("@hapi/joi");

// Routes

// All products
Router.get("/AllProducts", async (req, res) => {
  let allProducts = await productsDB.find();
  res.send(allProducts);
});

// All products by id
Router.get("/AllProducts/:id", async (req, res) => {
  let allProdsById = await productsDB.findById(req.params.id);
  if (!allProdsById) {
    return res.status(404).send({ message: "Product not found" });
  }
  res.send(allProdsById);
});

// Add products

Router.post("/AddProduct", async (req, res) => {
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
});

// Update product by id

Router.put("/updateProduct/:id", async (req, res) => {
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
});

// Delete product by id

Router.delete("/deleteProducts/:id", async (req, res) => {
  let deleteProductsById = await productsDB.findByIdAndDelete(req.params.id);
  if (!deleteProductsById) {
    return res.status(404).send("Product not found!");
  }
  res.send({ message: " Product deleted successfully!" });
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
