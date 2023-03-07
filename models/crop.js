"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for users. */

class Crop {
  // create({plantID, bedID, qty})    add 'planted_at'= CURRENT_TIMESTAMP in query

  /** Create crop with plantId, bedId, and qty.
   *
   * Returns { id, plantId, bedId, qty, plantedAt }
   *
   * Throws NotFoundError if plantID or bedId not found.
   **/
  static async create({ plantId, bedId, qty }) {
    const plantRes = await db.query(
      `SELECT id FROM plants
            WHERE id = $1 `,
      [plantId]
    );

    if (!plantRes.rows[0]) throw new NotFoundError(`No plant: ${plantId}`);

    const bedRes = await db.query(
      `SELECT id FROM beds
              WHERE id = $1 `,
      [bedId]
    );

    if (!bedRes.rows[0]) throw new NotFoundError(`No bed: ${bedId}`);

    const cropRes = await db.query(
      `INSERT into crops
            (plant_id, 
             bed_id, 
             qty, 
             planted_at)
        VALUES($1,$2,$3,CURRENT_TIMESTAMP)
        RETURNING id,plant_id AS "plantId", bed_id AS "bedId", qty, planted_at AS "plantedAt"
        `,
      [plantId, bedId, qty]
    );
    const plant = cropRes.rows[0];

    return plant;
  }

  /** Given a crop id, return data about crop.
   *
   * Returns { id, plantId, bedId, qty, plantedAt }
   *
   * Throws NotFoundError if crop not found.
   **/
  static async get(id) {
    const cropRes = await db.query(
      `SELECT   id,
                plant_id AS "plantId",
                bed_id AS "bedId",
                qty,
                planted_at AS "plantedAt"
            FROM crops
            WHERE id = $1`,
      [id]
    );

    const crop = cropRes.rows[0];

    if (!crop) throw new NotFoundError(`No crop: ${id}`);

    return crop;
  }

  // update(id,{plantID, bedId, qty})

  // delete(id)
}

module.exports = Crop;
