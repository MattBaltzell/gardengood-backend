"use strict";

const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const jsonschema = require("jsonschema");
const plantNewSchema = require("../schemas/plantNew.json");
const Plant = require("../models/plant");
const { BadRequestError } = require("../expressError");
const router = express.Router();

/** Create new plant */

router.post("/", ensureAdmin, async function (req, res, next) {
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

router.get("/", ensureLoggedIn, async function (req, res, next) {
  const q = req.query;
  try {
    const plants = await Plant.findAll({ q });
    return res.json({ plants });
  } catch (err) {
    return next(err);
  }
});

/** Get plant by id */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const plant = await Plant.get(req.params.id);
    return res.json({ plant });
  } catch (err) {
    return next(err);
  }
});

/** Delete plant by id */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const deleted = await Plant.remove(req.params.id);
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
