"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const Sunlight = require("../models/sunlight");
const GrowingSeason = require("../models/growingSeason");
const Instruction = require("../models/instruction");

class Plant {
  /**
   * Create plant
   *
   * data => {name,species,imgUrl,isPerrineal,description, daysToMaturityMin, daysToMaturityMax, sunlight[], growingSeasons[], instructions{}}
   */

  static async create(data) {
    const plantRes = await db.query(
      `
      INSERT INTO plants
        (name, species, img_url, is_perrenial, description, days_to_maturity_min, days_to_maturity_max)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id, name
      `,
      [
        data.name,
        data.species,
        data.imgUrl,
        data.isPerrenial,
        data.description,
        data.daysToMaturityMin,
        data.daysToMaturityMax,
      ]
    );

    const plant = plantRes.rows[0];

    /** Add Sunlight to Plant
     * takes in array of sunlightIds [sunlightId, sunlightId,...]
     */
    data.sunlight.forEach(async (sunlightId) => {
      await Sunlight.create(plant.id, sunlightId);
    });

    /** Add Growing Seasons to Plant
     * takes in array of seasonIds [seasonId, seasonId,...]
     */
    data.growingSeasons.forEach(async (seasonId) => {
      await GrowingSeason.create(plant.id, seasonId);
    });

    /** Add Instructions to Plant
     * takes in array of objects [{typeId, description},{typeId, description},...]
     */
    data.instructions.forEach(async (instruction) => {
      await Instruction.create(
        plant.id,
        instruction.typeId,
        instruction.description
      );
    });

    return plant.id;
  }

  /**
   * Find all plants
   */

  static async findAll() {
    const plants = await db.query(
      `
      SELECT p.id,
          p.name,
          p.species,
          p.img_url AS "imgUrl",
          p.is_perrenial AS "isPerrenial",
          p.description,
          p.days_to_maturity_min AS "daysToMaturityMin",
          p.days_to_maturity_max AS "daysToMaturityMax",
          json_agg(DISTINCT sun.name) AS "sunlight",
          json_agg(DISTINCT sea.name) AS "growingSeasons"
      FROM plants AS p
      JOIN plants_sunlight AS psu
      ON p.id = psu.plant_id
      JOIN sunlight AS sun
      ON psu.sunlight_id = sun.id
      JOIN plants_seasons AS pse
      ON p.id = pse.plant_id
      JOIN seasons AS sea
      ON pse.season_id = sea.id
      GROUP BY p.id
      ORDER BY p.name`
    );

    return plants.rows;
  }

  /** Given a plant id, return data about a plant */

  static async get(id) {
    const plantRes = await db.query(
      `
      SELECT p.id,
          p.name,
          p.species,
          p.img_url AS "imgUrl",
          p.is_perrenial AS "isPerrenial",
          p.description,
          p.days_to_maturity_min AS "daysToMaturityMin",
          p.days_to_maturity_max AS "daysToMaturityMax",
          json_agg(DISTINCT sun.name) AS "sunlight",
          json_agg(DISTINCT sea.name) AS "growingSeasons"
      FROM plants AS p
      JOIN plants_sunlight AS psu
      ON p.id = psu.plant_id
      JOIN sunlight AS sun
      ON psu.sunlight_id = sun.id
      JOIN plants_seasons AS pse
      ON p.id = pse.plant_id
      JOIN seasons AS sea
      ON pse.season_id = sea.id
      WHERE p.id = $1
      GROUP BY p.id`,
      [id]
    );

    if (!plantRes.rows[0]) throw new NotFoundError(`No plant: ${id}`);

    const plant = plantRes.rows[0];

    const instructionsRes = await db.query(
      `
      SELECT it.name, 
        i.description
      FROM instructions AS i
      JOIN instruction_types As it
      ON i.type_id = it.id
      WHERE i.plant_id = $1`,
      [id]
    );

    const instructionsArr = instructionsRes.rows;

    const instructions = { planting: "", pruning: "", watering: "" };
    instructionsArr.forEach(
      (inst) => (instructions[inst.name] = inst.description)
    );

    plant.instructions = instructions;

    return plant;
  }
}

module.exports = Plant;
