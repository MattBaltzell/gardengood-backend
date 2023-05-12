"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for crops. */

class Crop {
  /** CREATE -- Create crop with plantId, bedId, and qty.
   *
   * Returns { id, plantId, bedId, qty, plantedAt }
   *
   * Throws NotFoundError if plantID or bedId not found.
   **/
  static async create({ plantId, bedId, qty }) {
    const plantRes = await db.query(
      `SELECT id, name FROM plants
            WHERE id = $1 `,
      [plantId]
    );

    if (!plantRes.rows[0]) throw new NotFoundError(`No plant: ${plantId}`);

    const bedRes = await db.query(
      `SELECT id, garden_id FROM beds
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
        RETURNING id,
                  bed_id AS "bedId",
                  qty, 
                  planted_at AS "plantedAt"
        `,
      [plantId, bedId, qty]
    );
    const crop = cropRes.rows[0];

    crop.gardenId = bedRes.rows[0].garden_id;
    crop.plant = plantRes.rows[0];

    return crop;
  }

  /** GET -- Given a crop id, return data about crop.
   *
   * Returns { id, plantId, bedId, qty, plantedAt }
   *
   * Throws NotFoundError if crop not found.
   **/
  static async get(id) {
    const cropRes = await db.query(
      `SELECT c.id,
              c.plant_id AS "plantId",
              c.bed_id AS "bedId",
              b.garden_id AS "gardenId",
              c.qty,
              c.planted_at AS "plantedAt",
              json_build_object('id', p.id, 'name', p.name) AS plant
      FROM crops AS c
      JOIN beds AS b ON c.bed_id = b.id
      JOIN plants AS p ON c.plant_id = p.id
      WHERE c.id = $1`,
      [id]
    );

    const crop = cropRes.rows[0];
    if (!crop) throw new NotFoundError(`No crop: ${id}`);

    delete crop.plantId;

    return crop;
  }

  /** FIND ALL -- Given a bed id, return data about crops.
   *
   * Returns [{ id, plantId, bedId, qty, plantedAt }]
   *
   * Throws NotFoundError if crop not found.
   **/
  static async findAll() {
    const cropRes = await db.query(`
      SELECT c.id,
             c.plant_id AS "plantId",
             c.bed_id AS "bedId",
             b.garden_id AS "gardenId",
             c.qty,
             c.planted_at AS "plantedAt",
             json_build_object('id', p.id, 'name', p.name) AS plant
      FROM crops AS c
      JOIN beds AS b ON c.bed_id = b.id
      JOIN plants AS p ON c.plant_id = p.id
    `);

    const crops = cropRes.rows.map((crop) => {
      delete crop.plantId;
      return crop;
    });

    return crops;
  }

  /** UPDATE -- Given a crop id, update data about crops.
   *
   * Returns { id, plantId, bedId, qty, plantedAt }
   *
   * Throws NotFoundError if crop not found.
   **/
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      plantId: "plant_id",
      bedId: "bed_id",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE crops 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, plant_id AS "plantId", bed_id AS "bedId", qty`;

    const result = await db.query(querySql, [...values, id]);
    const updatedCrop = result.rows[0];

    if (!updatedCrop) throw new NotFoundError(`No crop: ${id}`);

    return updatedCrop;
  }

  /** DELETE -- Given a crop id, update data about crops.
   *
   * Returns { deleted: deletedId }
   *
   * Throws NotFoundError if crop not found.
   **/
  static async remove(id) {
    const deleteRes = await db.query(
      `DELETE FROM crops WHERE id = $1 RETURNING id`,
      [id]
    );

    const deletedId = deleteRes.rows[0]?.id;
    if (!deletedId) throw new NotFoundError(`No crop: ${id}`);

    return deleteRes.rows[0];
  }
}

module.exports = Crop;
