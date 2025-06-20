const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User, Supplier } = require("../server/models/index.js");

describe("Suppliers management tests", () => {
  let token = "";
  let id_housing;
  let userId;
  let createdSupplierId;
  let userId2;
  let token2 = "";

  beforeAll(async () => {
    // Create a test user - this user will be turned into an admin
    const testUser = {
      email: "suppliersteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    const created = await request(app).post("/users/register").send(testUser);
    userId = created.body.id_user;
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = res.body.accessToken; // Store the token for authenticated requests

    const testUser2 = {
      email: "suppliersteste2@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    const created2 = await request(app).post("/users/register").send(testUser2);
    userId2 = created2.body.id_user;
    const res4 = await request(app).post("/users/login").send({
      email: testUser2.email,
      password: testUser2.password,
    });
    token2 = res4.body.accessToken; // Store the token for authenticated requests

    // Turn user into admin
    const res3 = await request(app)
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: 1,
      });
  });

  test("POST /suppliers - should fail creating a new supplier if user not an admin", async () => {
    const res = await request(app)
      .post("/suppliers")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        enterprise: "GreenPower",
        cost_kWh: 0.18,
      });

    expect(res.statusCode).toBe(403);
  });

  test("POST /suppliers - should create a new supplier", async () => {
    const res = await request(app)
      .post("/suppliers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        enterprise: "GreenPower",
        cost_kWh: 0.18,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.enterprise).toBe("GreenPower");
    expect(res.body.data.cost_kWh).toBe(0.18);
    createdSupplierId = res.body.data.id;
  });

  test("GET /suppliers - should return all suppliers", async () => {
    const res = await request(app).get("/suppliers");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("PATCH /suppliers/:id - should partially update a supplier", async () => {
    const res = await request(app)
      .patch(`/suppliers/${createdSupplierId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        cost_kWh: 0.2,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.cost_kWh).toBe(0.2);
  });

  test("DELETE /suppliers/:id - should delete a supplier", async () => {
    const res = await request(app)
      .delete(`/suppliers/${createdSupplierId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    // Clean test data
    await User.destroy({ where: { email: "suppliersteste@exemplo.com" } });
    // await User.destroy({ where: { email: "suppliersteste2@exemplo.com" } });
    await Supplier.destroy({ where: { id: createdSupplierId } });
    await app.sequelize.close();
  });
});
