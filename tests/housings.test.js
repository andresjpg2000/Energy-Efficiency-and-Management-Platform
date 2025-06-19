const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Housing management tests", () => {
  let token = "";
  let token2 = "";
  let id_housing;
  let wrongId = 9999999; // A non-existing housing ID for testing
  let wrongId2; // housing id not owned by test user

  beforeAll(async () => {
    // Create a test user
    const testUser = {
      email: "housingsteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    // Create a second test user for ownership tests
    const testUser2 = {
      email: "housingsteste2@exemplo.com",
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

    // Create a new housing and get a housing ID that belongs to the second user
    const res3 = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        address: "123 Test Street 2",
        pc: "1234567",
        location: "Test City",
        building_type: "studio",
        id_supplier: 2,
        custom_supplier_price: 0.3,
      });

    wrongId2 = res3.body.data.id_housing;
  });

  test("GET /housings - should return 401 if not authenticated", async () => {
    const res = await request(app).get("/housings");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized, no token provided!");
  });

  test("POST /housings - should create a new housing", async () => {
    const res = await request(app)
      .post("/housings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "123 Test Street",
        pc: "1234567",
        location: "Test City",
        building_type: "flat",
        id_supplier: 1,
        custom_supplier_price: 0.25,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id_housing");
    id_housing = res.body.data.id_housing;
  });

  test("GET /housings - should return every house from user", async () => {
    const res = await request(app)
      .get("/housings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id_housing,
          address: "123 Test Street",
        }),
      ]),
    );
  });

  test("GET /housings/:id_housing/location - should return the location", async () => {
    const res = await request(app)
      .get(`/housings/${id_housing}/location`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.location).toBe("Test City");
  });

  test("PATCH /housings/:id_housing - should update housing", async () => {
    const res = await request(app)
      .patch(`/housings/${id_housing}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ address: "456 Updated Street" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(
      `Housing with ID ${id_housing} updated successfully!`,
    );
  });

  test("PATCH /housings/:id_housing - should return 404 if housing not found", async () => {
    const res = await request(app)
      .patch(`/housings/${wrongId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ address: "456 Updated Street" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Housing not found!");
  });

  test("PATCH /housings/:id_housing - should return 403 if housing not owned by user", async () => {
    const res = await request(app)
      .patch(`/housings/${wrongId2}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ address: "456 Updated Street" });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(
      "You are not authorized to access this housing!",
    );
  });

  test("PATCH /housings/:id_housing - should return 400 if no changes are provided", async () => {
    const res = await request(app)
      .patch(`/housings/${id_housing}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ address: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "At least one of address, postal code, id_supplier, supplier price or building type must be provided!",
    );
  });

  test("GET /housings/:id_housing/energy-consumptions - should return all energy consumptions from housing", async () => {
    const res = await request(app)
      .get(`/housings/${id_housing}/energy-consumptions`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(expect.arrayContaining([]));
  });

  test("GET /housings/:id_housing/equipments - should return all equipments from housing", async () => {
    const res = await request(app)
      .get(`/housings/${id_housing}/equipments`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(expect.arrayContaining([]));
  });

  test("DELETE /housings/:id_housing - should delete housing", async () => {
    const res = await request(app)
      .delete(`/housings/${id_housing}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    // Clean test data
    await User.destroy({ where: { email: "housingsteste@exemplo.com" } }); // This will also delete the housing due to cascading
    await User.destroy({ where: { email: "housingsteste2@exemplo.com" } });
    await app.sequelize.close();
  });
});
