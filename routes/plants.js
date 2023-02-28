"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const plantNewSchema = require("../schemas/plantNew.json");
const Plant = require("../models/plant");
const { BadRequestError } = require("../expressError");
const router = express.Router();

/** Create new plant */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, plantNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const plant = await Plant.create(req.body);
    return res.status(201).json(plant);
  } catch (err) {
    return next(err);
  }
});

/** Show all plants */

router.get("/", async function (req, res, next) {
  try {
    const plants = await Plant.findAll();
    return res.json({ plants });
  } catch (err) {
    return next(err);
  }
});

/** Get plant by id */

router.get("/:id", async function (req, res, next) {
  try {
    const plant = await Plant.get(req.params.id);
    return res.json({ plant });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
