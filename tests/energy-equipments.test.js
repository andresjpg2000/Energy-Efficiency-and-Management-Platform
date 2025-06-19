const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Energy-equipments related tests", () => {
  let token = "";
  let token2 = "";
  let id_housing;
  let wrongId2; // housing id not owned by test user
  let newHouseData;
  let invalidId = -1; // an ID that does not exist

  beforeAll(async () => {
    // Create a test user
    const testUser = {
      email: "equipmentsteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    // Create a second test user for ownership tests
    const testUser2 = {
      email: "equipmentsteste2@exemplo.com",
      password: "Password123",
      name: "Test User 2",
    };

    const created = await request(app).post("/users/register").send(testUser);
    const created2 = await request(app).post("/users/register").send(testUser2);

    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const res2 = await request(app).post("/users/login").send({
      email: testUser2.email,
      password: testUser2.password,
    });

    token = res.body.accessToken; // Store the token for authenticated requests
    token2 = res2.body.accessToken; // Store the second user's token for ownership tests

    const res3 = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "123 Equipments Test Street",
        pc: "3123957",
        location: "Equipment City",
        building_type: "flat",
        id_supplier: 1,
        custom_supplier_price: 0.25,
      });

    id_housing = res3.body.data.id_housing;
    // Create a new housing and get a housing ID that belongs to the second user
    const res4 = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        address: "123 Equipments Test Street 2",
        pc: "2133456",
        location: "Equipments City 2",
        building_type: "studio",
        id_supplier: 2,
        custom_supplier_price: 0.3,
      });

    wrongId2 = res4.body.data.id_housing;
  });

  test("/POST /energy-equipments - should create a new energy equipment", async () => {
    const res = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        energy_type: 1,
        capacity: 100,
        housing: id_housing,
        name: "Test Equipment",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id_equipment");
    equipmentId = res.body.id_equipment;
  });

  test("/POST /energy-equipments - should fail if required fields missing", async () => {
    const res = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({ capacity: 100, housing: id_housing }); // missing energy_type
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Missing required fields.");
  });

  test("/POST /energy-equipments - should fail if housing does not exist", async () => {
    const res = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        energy_type: 1,
        capacity: 100,
        housing: 99999999,
        name: "Test",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Housing ID does not exist.");
  });

  test("/POST /energy-equipments - should fail if user not authenticated", async () => {
    const res = await request(app).post("/energy-equipments").send({
      energy_type: 1,
      capacity: 100,
      housing: id_housing,
      name: "No login",
    });
    expect(res.statusCode).toBe(401);
  });

  test("/POST /energy-equipments - should fail if user tries to create equipment in a housing they do not own", async () => {
    const res = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        energy_type: 1,
        capacity: 100,
        housing: id_housing, // housing owned by the first user
        name: "Test Equipment 2",
      });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch("You do not own this housing.");
  });

  test("/PATCH /energy-equipments/:id_equipment - should update equipment name", async () => {
    const res = await request(app)
      .patch(`/energy-equipments/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Equipment Name" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("The name has been successfully changed.");
  });

  test("/PATCH /energy-equipments/:id_equipment - should return 400 if name missing or invalid", async () => {
    let res = await request(app)
      .patch(`/energy-equipments/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .patch(`/energy-equipments/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "ab", extra: "field" });
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .patch(`/energy-equipments/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "ab" }); // name too short
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if equipment not found", async () => {
    const res = await request(app)
      .patch(`/energy-equipments/${invalidId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Valid Name" });
    expect(res.statusCode).toBe(404);
  });

  test("/PATCH /energy-equipments/:id_equipment - should return 403 if user does not own the equipment", async () => {
    const res = await request(app)
      .patch(`/energy-equipments/${equipmentId}`)
      .set("Authorization", `Bearer ${token2}`)
      .send({ name: "Unauthorized Update" });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch("You do not own this equipment.");
  });

  test("/GET /energy-equipments/:id_equipment/given-energies - should return 404 if equipment not found", async () => {
    const res = await request(app)
      .get(`/energy-equipments/${4}/given-energies`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test("/GET /energy-equipments/:id_equipment/given-energies - should return energies (empty array if none) with valid equipment", async () => {
    const res = await request(app)
      .get(`/energy-equipments/${equipmentId}/given-energies`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("givenEnergy");
    expect(Array.isArray(res.body.data.givenEnergy)).toBe(true);
  });

  test("/GET /energy-equipments/:id_equipment/given-energies - should return 400 for invalid date query params", async () => {
    const res = await request(app)
      .get(`/energy-equipments/${equipmentId}/given-energies?start=bad-date`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  test("/GET /energy-equipments/:id_equipment/given-energies - should return 400 if start date is after end date", async () => {
    const res = await request(app)
      .get(
        `/energy-equipments/${equipmentId}/given-energies?start=2024-01-02&end=2024-01-01`,
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  test("/GET /energy-equipments/:id_equipment/energy-productions - should return 404 if equipment not found", async () => {
    const res = await request(app)
      .get(`/energy-equipments/${4}/energy-productions`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test("should return productions (empty array if none) with valid equipment", async () => {
    const res = await request(app)
      .get(`/energy-equipments/${equipmentId}/energy-productions`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("EnergyProductions");
    expect(Array.isArray(res.body.data.EnergyProductions)).toBe(true);
  });

  test("should return 400 for invalid date query params", async () => {
    const res = await request(app)
      .get(
        `/energy-equipments/${equipmentId}/energy-productions?start=bad-date`,
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  test("should return 400 if start date is after end date", async () => {
    const res = await request(app)
      .get(
        `/energy-equipments/${equipmentId}/energy-productions?start=2024-01-02&end=2024-01-01`,
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  test("/DELETE /energy-equipments/:id_equipment - should delete the equipment", async () => {
    const res = await request(app)
      .delete(`/energy-equipments/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    // Clean test data
    await User.destroy({ where: { email: "equipmentsteste@exemplo.com" } }); // This will also delete the housing due to cascading
    await User.destroy({ where: { email: "equipmentsteste2@exemplo.com" } });
    await app.sequelize.close();
  });
});
