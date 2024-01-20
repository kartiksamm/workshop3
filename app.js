"use strict";
const express = require("express");
const app = express();

const morgan = require("morgan");

app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("hello from the middleware");
  next();
});

module.exports = app;
