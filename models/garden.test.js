const db = require("../db");
const Garden = require("../models/garden");
const { NotFoundError } = require("../expressError");

// Mock the db.query function
jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("Garden model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("creates a new garden", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1 }],
      });

      const gardenData = {
        username: "testuser",
        name: "My Garden",
        description: "A beautiful garden",
      };

      const result = await Garden.create(gardenData);

      expect(result).toEqual({
        garden: {
          id: 1,
          name: "My Garden",
          description: "A beautiful garden",
          users: ["testuser"],
        },
      });

      expect(db.query).toHaveBeenCalledTimes(2); // Two queries executed: INSERT INTO gardens, INSERT INTO users_gardens
    });
  });

  describe("get", () => {
    test("retrieves garden by id", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "My Garden",
            description: "A beautiful garden",
          },
        ],
      });

      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Bed 1",
          },
          {
            id: 2,
            name: "Bed 2",
          },
        ],
      });

      const result = await Garden.get(1);

      expect(result).toEqual({
        id: 1,
        name: "My Garden",
        description: "A beautiful garden",
        beds: [
          { id: 1, name: "Bed 1" },
          { id: 2, name: "Bed 2" },
        ],
      });

      expect(db.query).toHaveBeenCalledTimes(2); // Two queries executed: SELECT garden, SELECT beds
    });

    test("throws NotFoundError if garden not found", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [],
      });

      await expect(Garden.get(1)).rejects.toThrow(NotFoundError);
      expect(db.query).toHaveBeenCalledTimes(1); // One query executed: SELECT garden
    });
  });

  describe("findAll", () => {
    test("retrieves all gardens for a username", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Garden 1",
            description: "Description 1",
          },
          {
            id: 2,
            name: "Garden 2",
            description: "Description 2",
          },
        ],
      });

      const result = await Garden.findAll("testuser");

      expect(result).toEqual([
        {
          id: 1,
          name: "Garden 1",
          description: "Description 1",
        },
        {
          id: 2,
          name: "Garden 2",
          description: "Description 2",
        },
      ]);

      expect(db.query).toHaveBeenCalledTimes(1); // One query executed: SELECT gardens
    });
  });

  describe("update", () => {
    test("updates garden data", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Updated Garden",
            description: "Updated description",
          },
        ],
      });

      const result = await Garden.update(1, {
        name: "Updated Garden",
        description: "Updated description",
      });

      expect(result).toEqual({
        id: 1,
        name: "Updated Garden",
        description: "Updated description",
      });

      expect(db.query).toHaveBeenCalledTimes(1); // One query executed: UPDATE gardens
    });

    test("throws NotFoundError if garden not found", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [],
      });

      await expect(
        Garden.update(1, {
          name: "Updated Garden",
          description: "Updated description",
        })
      ).rejects.toThrow(NotFoundError);

      expect(db.query).toHaveBeenCalledTimes(1); // One query executed: UPDATE gardens
    });
  });

  describe("remove", () => {
    test("deletes a garden", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [
          {
            deleted: 1,
          },
        ],
      });

      const result = await Garden.remove(1);

      expect(result).toEqual({ deleted: 1 });

      expect(db.query).toHaveBeenCalledTimes(1); // One query executed: DELETE from gardens
    });

    test("throws NotFoundError if garden not found", async () => {
      // Mock the database query response
      db.query.mockResolvedValueOnce({
        rows: [],
      });

      await expect(Garden.remove(1)).rejects.toThrow(NotFoundError);
      expect(db.query).toHaveBeenCalledTimes(1); // One query executed: DELETE from gardens
    });
  });
});
