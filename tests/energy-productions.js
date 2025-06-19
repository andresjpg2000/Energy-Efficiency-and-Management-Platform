const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Energy-production related tests", () => {
  let token = "";
  let token2 = "";
  let id_housing;
  let wrongId2; // housing id not owned by test user
  let newHouseData;

  beforeAll(async () => {
    // Create a test user
    const testUser = {
      email: "productionsteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    // Create a second test user for ownership tests
    const testUser2 = {
      email: "productionsteste2@exemplo.com",
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
        address: "123 Production Test Street",
        pc: "3123957",
        location: "Production City",
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
        address: "123 Production Test Street 2",
        pc: "2133456",
        location: "Production City 2",
        building_type: "studio",
        id_supplier: 2,
        custom_supplier_price: 0.3,
      });

    wrongId2 = res4.body.data.id_housing;
  });

  afterAll(async () => {
    // Clean test data
    await User.destroy({ where: { email: "productionsteste@exemplo.com" } }); // This will also delete the housing due to cascading
    await User.destroy({ where: { email: "productionsteste2@exemplo.com" } });
  });
});
