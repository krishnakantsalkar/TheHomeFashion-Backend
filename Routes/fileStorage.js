let express = require("express");
let Router = express.Router();
let fileDB = require("../DB/fileStorageSchema");
let multer = require("multer");
let path = require("path");
let pathDir = path.join(__dirname, "../uploads");
let port = "http://localhost:4600/";

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, pathDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

let fileFilter = function(req, file, cb) {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let fileStorage = multer({
  storage: storage,
  limits: { fileSize: 1500 * 1500 * 5 },
  fileFilter: fileFilter
});

Router.post("/fileUpload", fileStorage.single("image"), async (req, res) => {
  try {
    let data = new fileDB({
      image: port + "uploads/" + req.file.filename
    });
    console.log(data);
    if (!data) {
      return res.status(404).send({ message: "file not found" });
    }
    let savedImages = await data.save();
    res.send({ message: "Image Stored Successfull!", data: savedImages });
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.get("/allFiles", async (req, res) => {
  try {
    let files = await fileDB.find();
    res.send(files);
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.get("/allFiles/:id", async (req, res) => {
  try {
    let filesById = await fileDB.findById(req.params.id);
    if (!filesById) {
      return res.status(404).send({ message: "File id not found" });
    }
    res.send(filesById);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = Router;
