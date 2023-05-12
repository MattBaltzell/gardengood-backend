"use strict";

/** Routes for user gardens. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Garden = require("../models/garden");
const gardenNewSchema = require("../schemas/gardenNew.json");
const gardenUpdateSchema = require("../schemas/gardenUpdate.json");
const router = express.Router();

/**************************************************************
 **************************************************************
 * USER GARDENS ROUTES
 **************************************************************
 **************************************************************
 * */

/** POST /[username]/gardens => { garden }
 *
 * Returns { id, name, description, users[] }
 *
 * Authorization required: correct user or admin
 **/

router.post(
  "/:username/gardens",
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

/** GET /[username]/gardens/[id] => { garden }
 *
 * Returns { id, name, description, users[] }
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username/gardens/:id",
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

/** GET /[username]/gardens => { garden }
 *
 * Returns { id, name, description, users[] }
 *
 * Authorization required: correct user or admin
 **/

router.get(
  "/:username/gardens",
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

/** PATCH /[username]/gardens/[id] => { garden }
 *
 * Returns { id, name, description }
 *
 * Authorization required: correct user or admin
 **/

router.patch(
  "/:username/gardens/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, gardenUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const id = req.params.id;
      const garden = await Garden.update(id, req.body);
      return res.json({ garden });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/gardens/[id] => { garden }
 *
 * Returns { deleted: name }
 *
 * Authorization required: correct user or admin
 **/
router.delete(
  "/:username/gardens/:id",
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
