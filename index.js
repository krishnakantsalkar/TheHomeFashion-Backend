// Initial Setup

let express = require("express");
let app = express();

let mongoose = require("mongoose");

let port = process.env.PORT || 4600;
let morgan = require("morgan");

let path = require("path");

let config = require("config");
process.env.NODE_CONFIG_DIR = "./config";
let cors = require("cors");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Enviornment Variables

console.log(`Environment Mode: ${app.get("env")}`);
console.log(`Development: ${config.get("info")}`);
console.log(`Info: ${config.get("default")}`);
console.log(`Enviornment Key : ${config.get("SecretKey")}`);

// Check Secret key

if (!config.get("SecretKey")) {
  console.log(`Fatal Error: Set Key first`);
  process.exit(1);
}

// Project

let userReg = require("./Routes/userRegistration");
let userLog = require("./Routes/userLogin");

//Allowed  Routes

app.use("/api/newUsers/", userReg);
app.use("/api/newUsers/", userLog);

// Mongo DB connection

mongoose
  .connect("mongodb://localhost/MongooseDB-1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Connection successful to Database`))
  .catch(ex =>
    console.log(`Something went wrong with, please check:s ${ex.message}`)
  );

app.listen(port, () => console.log(`Connection Successfull to ${port}`));
