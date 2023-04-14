"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Garden = require("../models/garden");
const Bed = require("../models/bed");
const Crop = require("../models/crop");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [ {username, firstName, lastName, email ,zipCode}, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, zipCode, isAdmin }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email , zipCode}
 *
 * Returns { username, firstName, lastName, email, zipCode, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

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
      const { name } = req.body;
      const { gardenId } = req.params;
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

module.exports = router;
