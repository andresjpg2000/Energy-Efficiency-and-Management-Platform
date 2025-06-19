const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Alerts related tests", () => {
  let token = "";
  let token2 = "";
  let id_housing;
  let houseId2;
  let userId;
  let userId2;
  let id_equipment1;
  let id_equipment2;
  let givenEnergyId;

  beforeAll(async () => {
    const testUser = {
      email: "giventeste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };

    const testUser2 = {
      email: "giventeste2@exemplo.com",
      password: "Password123",
      name: "Test User 2",
    };

    const created = await request(app).post("/users/register").send(testUser);
    userId = created.body.id_user;
    const created2 = await request(app).post("/users/register").send(testUser2);
    userId2 = created2.body.id_user;

    const res = await request(app).post("/users/login").send(testUser);
    token = res.body.accessToken;

    const res2 = await request(app).post("/users/login").send(testUser2);
    token2 = res2.body.accessToken;

    const res3 = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "123 GivenEnergies Test Street",
        pc: "3123487",
        location: "GivenEnergies City",
        building_type: "flat",
        id_supplier: 1,
        custom_supplier_price: 0.25,
      });
    id_housing = res3.body.data.id_housing;

    const res4 = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        address: "123 GivenEnergies Test Street 2",
        pc: "2123356",
        location: "GivenEnergies City 2",
        building_type: "studio",
        id_supplier: 2,
        custom_supplier_price: 0.3,
      });
    houseId2 = res4.body.data.id_housing;

    const equipmentRes = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        energy_type: 1,
        capacity: 100,
        housing: id_housing,
        name: "Test Equipment GivenEnergies",
      });
    id_equipment1 = equipmentRes.body.id_equipment;

    const equipmentRes2 = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        energy_type: 1,
        capacity: 50,
        housing: houseId2,
        name: "Test Equipment GivenEnergies 2",
      });
    id_equipment2 = equipmentRes2.body.id_equipment;
  });

  test("POST /given-energies - should add a new energy return", async () => {
    const res = await request(app)
      .post("/given-energies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_equipment: id_equipment1,
        date: new Date(),
        value: 123.45,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    givenEnergyId = res.body.data.id;
  });

  test("GET /given-energies - should retrieve energy returns by user ID", async () => {
    const res = await request(app)
      .get("/given-energies")
      .set("Authorization", `Bearer ${token}`)
      .query({
        userId: userId,
        page: 1,
        size: 10,
      });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty("total");
  });

  test("DELETE /given-energies/:id - should delete an energy return", async () => {
    const res = await request(app)
      .delete(`/given-energies/${givenEnergyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    await User.destroy({ where: { email: "giventeste@exemplo.com" } });
    await User.destroy({ where: { email: "giventeste2@exemplo.com" } });
    await app.sequelize.close();
  });
});
