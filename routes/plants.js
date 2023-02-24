"use strict";

const express = require("express");
const Plant = require("../models/plant");
const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const plants = await Plant.findAll();
    return res.json({ plants });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const plant = await Plant.get(req.params.id);
    return res.json({ plant });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
