"use strict";

const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const jsonschema = require("jsonschema");
// const bedNewSchema = require("../schemas/bedNew.json");
const Bed = require("../models/bed");
const { BadRequestError } = require("../expressError");
const router = express.Router();

/** Create new bed */

/** POST / => { bed }
 *
 * Returns { id, name, gardenId }
 *
 * Authorization required: logged in
 **/

// router.post("/", ensureLoggedIn, async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(req.body, bedNewSchema);
//     if (!validator.valid) {
//       const errs = validator.errors.map((e) => e.stack);
//       throw new BadRequestError(errs);
//     }
//     const bed = await Bed.create(req.body);
//     return res.status(201).json(bed);
//   } catch (err) {
//     return next(err);
//   }
// });

/** GET /[username] => { user }
 *
 * Returns { id, plantId, bedId, qty, plantedAt }
 *
 * Authorization required: logged in
 **/

// router.get("/:id", ensureLoggedIn, async function (req, res, next) {
//   try {
//     const bed = await Bed.get(req.params.id);
//     return res.json({ bed });
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = router;
