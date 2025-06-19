const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Energy-production related tests", () => {
  let token = "";
  let token2 = "";
  let id_housing;
  let id_equipment;
  let id_production;
  let userId;

  beforeAll(async () => {
    // Create users
    const testUser = {
      email: "productionsteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    const testUser2 = {
      email: "productionsteste2@exemplo.com",
      password: "Password123",
      name: "Test User 2",
    };

    const created = await request(app).post("/users/register").send(testUser);
    userId = created.body.id_user;
    await request(app).post("/users/register").send(testUser2);

    const res = await request(app).post("/users/login").send(testUser);
    const res2 = await request(app).post("/users/login").send(testUser2);
    token = res.body.accessToken;
    token2 = res2.body.accessToken;

    const res3 = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "123 Production Test Street",
        pc: "3123957",
        location: "Production City",
        building_type: "flat",
        id_supplier: 1,
        custom_supplier_price: 0.25,
      });

    id_housing = res3.body.data.id_housing;

    const res4 = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        address: "123 Production Test Street 2",
        pc: "2133456",
        location: "Production City 2",
        building_type: "studio",
        id_supplier: 2,
        custom_supplier_price: 0.3,
      });

    wrongId2 = res4.body.data.id_housing;

    // Create equipment
    const equipmentRes = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        energy_type: 1,
        capacity: 100,
        housing: id_housing,
        name: "Test Equipment",
      });

    id_equipment = equipmentRes.body.id_equipment;
  });

  test("/POST /energy-productions - should add energy production", async () => {
    const res = await request(app)
      .post("/energy-productions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_equipment,
        date: Date.now(),
        value: 15.55,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id_production");
    id_production = res.body.data.id_production;
  });

  test("/POST /energy-productions - should fail to add production with missing fields", async () => {
    const res = await request(app)
      .post("/energy-productions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_equipment,
        value: 10,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(
      "Equipament ID, Date and Value are required",
    );
  });

  test("/GET /energy-productions - should fetch user productions", async () => {
    const res = await request(app)
      .get("/energy-productions")
      .set("Authorization", `Bearer ${token}`)
      .query({
        userId,
        size: 5,
        page: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("/GET /energy-productions - should fail if no productions are found", async () => {
    const res = await request(app)
      .get("/energy-productions")
      .set("Authorization", `Bearer ${token2}`)
      .query({
        userId: 2,
        size: 5,
        page: 1,
      });

    expect(res.statusCode).toBe(404);
  });

  test("/GET /energy-productions - should fail with invalid date format", async () => {
    const res = await request(app)
      .get("/energy-productions")
      .set("Authorization", `Bearer ${token}`)
      .query({
        userId: 1,
        start: "not-a-date",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Invalid date format");
  });

  test("/DELETE /energy-productions/:id_equipment - should delete production", async () => {
    const res = await request(app)
      .delete(`/energy-productions/${id_production}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  test("/DELETE /energy-productions/:id_equipment - should fail to delete non-existent production", async () => {
    const res = await request(app)
      .delete(`/energy-productions/999999`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await User.destroy({
      where: {
        email: [
          "productionsteste@exemplo.com",
          "productionsteste2@exemplo.com",
        ],
      },
    });
    await app.sequelize.close();
  });
});
