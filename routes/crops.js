"use strict";

const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const jsonschema = require("jsonschema");
const cropNewSchema = require("../schemas/cropNew.json");
const Crop = require("../models/crop");
const { BadRequestError } = require("../expressError");
const router = express.Router();

/** Create new crop */

/** PST / => { crop }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: logged in
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, cropNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const crop = await Crop.create(req.body);
    return res.status(201).json(crop);
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: logged in
 **/

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const crop = await Crop.get(req.params.id);
    return res.json({ crop });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
