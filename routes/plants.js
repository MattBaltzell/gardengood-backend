"use strict";

const express = require("express");
const Plant = require("../models/plant");
const router = express.Router();

router.post("/", async function (req, res, next) {
  try {
    const {
      name,
      species,
      imgUrl,
      isPerrenial,
      description,
      daysToMaturityMin,
      daysToMaturityMax,
      sunlight,
      growingSeasons,
      instructions,
    } = req.body;
    const plant = await Plant.create({
      name,
      species,
      imgUrl,
      isPerrenial,
      description,
      daysToMaturityMin,
      daysToMaturityMax,
      sunlight,
      growingSeasons,
      instructions,
    });
    return res.status(201).json({ plant });
  } catch (err) {
    return next(err);
  }
});

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
