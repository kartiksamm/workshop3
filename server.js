const File = require("./models/tourModel");
const mongoose = require("mongoose");
const app = require("./app");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log("db connection succesful");
  });
const port = 3000;
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1mb limit
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Only JPEG/PNG files are allowed!"));
    }
  },
});

// API to upload a file
app.put("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }

  const newFile = new File({
    name: req.file.originalname,
    data: req.file.buffer,
  });

  await newFile.save();

  res.json({ file: newFile });
});
//
// API to delete a file by ID
app.delete("/delete-file/:fileId", async (req, res) => {
  const fileId = req.params.fileId;

  const file = await File.findById(fileId);
  if (!file) {
    return res.status(404).json({ error: "File not found!" });
  }

  await file.remove();
  res.json({ message: "File deleted successfully!" });
});
//API to rename a file by id
app.post("/rename-file/:fileId", express.json(), async (req, res) => {
  const fileId = req.params.fileId;
  const newName = req.body.newName;

  const file = await File.findById(fileId);
  if (!file) {
    return res.status(404).json({ error: "File not found!" });
  }

  file.name = newName;
  await file.save();
  res.json({ file });
});
app.listen(port, () => {
  console.log(`server runing on port no ${port}`);
});
