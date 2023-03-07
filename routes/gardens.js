"use strict";

const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const jsonschema = require("jsonschema");
const gardenNewSchema = require("../schemas/gardenNew.json");
const Garden = require("../models/garden");
const { BadRequestError } = require("../expressError");
const router = express.Router();

/** POST / => { garden }
 *
 * Returns { id, name, description, users[] }
 *
 * Authorization required: correct user or admin
 **/

router.post(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, gardenNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const username = req.params.username;
      const garden = await Garden.create({ username, ...req.body });
      return res.status(201).json(garden);
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/[id] => { garden }
 *
 * Returns { id, name, description, users[] }
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const garden = await Garden.get(req.params.id);
      return res.json({ garden });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username] => { garden }
 *
 * Returns { id, name, description, users[] }
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const gardens = await Garden.findAll(req.params.username);
      return res.json({ gardens });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/[id] => { garden }
 *
 * Returns { deleted: name }
 *
 * Authorization required: correct user or admin
 **/
router.delete(
  "/:username/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const garden = await Garden.remove(req.params.id);
      return res.json({ deleted: garden.name });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
