"use strict";

/** Routes for user beds. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Bed = require("../models/bed");
const bedNewSchema = require("../schemas/bedNew.json");
const router = express.Router();

/**************************************************************
 **************************************************************
 * USER BEDS ROUTES
 **************************************************************
 **************************************************************
 * */

/** Create new bed */

/** POST /[username]/beds => { bed }
 *
 * Returns { id, name, gardenId }
 *
 * Authorization required: correct user or admin
 **/

router.post(
  "/:username/beds",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, bedNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const { name, gardenId } = req.body;
      const bed = await Bed.create({ name, gardenId });
      return res.status(201).json(bed);
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/beds/[id] => { bed }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username/beds/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const bed = await Bed.get(req.params.id);
      return res.json({ bed });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/gardens/[gardenId]/beds => [{ bed },{ bed },...]
 *
 * Returns [{ id, name, gardenId, }, ...]
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username/gardens/:gardenId/beds",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const beds = await Bed.findAll(req.params.gardenId);
      return res.json({ beds });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/beds/[id] => { bed }
 *
 * Returns { deleted: name }
 *
 * Authorization required: correct user or admin
 **/
router.delete(
  "/:username/beds/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const bed = await Bed.remove(req.params.id);
      return res.json({ deleted: bed.name });
    } catch (err) {
      return next(err);
    }
  }
);
module.exports = router;
