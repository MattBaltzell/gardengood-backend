"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Instruction {
  /**
   * Create plant_season entry
   */

  static async create(plantId, typeId, description) {
    const instructionRes = await db.query(
      `
        INSERT INTO instructions
          (plant_id, type_id,description)
          VALUES ($1,$2,$3)
          returning plant_id AS "plantId", type_id AS "typeId"
        `,
      [plantId, typeId, description]
    );

    return instructionRes.rows[0];
  }
}

module.exports = Instruction;
