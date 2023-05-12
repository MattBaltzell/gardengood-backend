"use strict";

/** Routes for user crops. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Crop = require("../models/crop");
const cropNewSchema = require("../schemas/cropNew.json");
const cropUpdateSchema = require("../schemas/cropUpdate.json");
const router = express.Router();

/**************************************************************
 **************************************************************
 * USER CROPS ROUTES
 **************************************************************
 **************************************************************
 * */

/** Create new crop */

/** POST /[username]/crops => { crop }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: correct user or admin
 **/

router.post(
  "/:username/crops",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
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
  }
);

/** Find a crop */

/** GET /[username]/crops/[cropId] => { crop }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username/crops/:cropId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const crop = await Crop.get(req.params.cropId);
      return res.json({ crop });
    } catch (err) {
      return next(err);
    }
  }
);

/** Find all crops in a bed */

/** GET /bed[bedId] => { user }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username/beds/:bedId/crops",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const crops = await Crop.findAll(req.params.bedId);
      return res.json({ crops });
    } catch (err) {
      return next(err);
    }
  }
);

/** Update crop */

/** PATCH /[username]/crops/[cropId] => { crop }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: correct user or admin
 **/
/** PATCH */

router.patch(
  "/:username/crops/:cropId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, cropUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const id = req.params.cropId;
      const crop = await Crop.update(id, req.body);
      return res.json({ crop });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/crops/[cropId] => { deleted }
 *
 * Returns { deleted: cropId }
 *
 * Authorization required: correct user or admin
 **/
router.delete(
  "/:username/crops/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const crop = await Crop.remove(req.params.id);
      return res.json({ deleted: crop.id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
