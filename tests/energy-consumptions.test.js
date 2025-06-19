const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Energy-consumption related tests", () => {
  let token = "";
  let token2 = "";
  let id_housing;
  let wrongId2; // housing id not owned by test user
  let newHouseData;

  beforeAll(async () => {
    // Create a test user
    const testUser = {
      email: "consumptionsteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    // Create a second test user for ownership tests
    const testUser2 = {
      email: "consumptionsteste2@exemplo.com",
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
        address: "123 Consumption Test Street",
        pc: "3123457",
        location: "Consumption City",
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
        address: "123 Consumption Test Street 2",
        pc: "2123456",
        location: "Consumption City 2",
        building_type: "studio",
        id_supplier: 2,
        custom_supplier_price: 0.3,
      });

    wrongId2 = res4.body.data.id_housing;
  });

  test("POST /energy-consumptions - should fail when adding a new energy consumption to a house not owned by the user", async () => {
    const res = await request(app)
      .post(`/energy-consumptions`)
      .set("Authorization", `Bearer ${token2}`)
      .send({
        value: 0.05,
        date: Date.now(),
        id_housing,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("You do not have access to this housing.");
  });

  test("POST /energy-consumptions - should fail when adding a new energy consumption without all the required attributes", async () => {
    const res = await request(app)
      .post(`/energy-consumptions`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        date: Date.now(),
        id_housing,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("value, date and id_housing are required!");
  });

  test("POST /energy-consumptions - should add a new energy consumption to a house owned by the user", async () => {
    const res = await request(app)
      .post(`/energy-consumptions`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 0.05,
        date: Date.now(),
        id_housing,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.value).toBe(0.05);
    newHouseData = res.body.data;
  });

  test("GET /housings/:id_housing/energy-consumptions - should return an array with the new consumption added", async () => {
    const res = await request(app)
      .get(`/housings/${id_housing}/energy-consumptions`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id_housing).toBe(newHouseData.id_housing);
    expect(res.body.data.consumptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "0.05",
        }),
      ]),
    );
  });

  test("DELETE /energy-consumptions/:id_consumption - should fail when trying to delete a consumption. Only admins can do it", async () => {
    const res = await request(app)
      .delete(`/energy-consumptions/${newHouseData.id_consumption}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe(
      "Forbidden: You do not have permission to access this resource.",
    );
  });

  afterAll(async () => {
    // Clean test data
    await User.destroy({ where: { email: "consumptionsteste@exemplo.com" } }); // This will also delete the housing due to cascading
    await User.destroy({ where: { email: "consumptionsteste2@exemplo.com" } });
  });
});
