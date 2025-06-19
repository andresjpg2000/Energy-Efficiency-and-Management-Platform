const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Alerts related tests", () => {
  let token = "";
  let token2 = "";
  let id_housing;
  let houseId2; // housing id owned by second test user
  let newHouseData;
  let userId;
  let userId2;
  let id_equipment1;
  let id_equipment2;
  let id_notification;

  beforeAll(async () => {
    // Create a test user
    const testUser = {
      email: "alertsteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    // Create a second test user for ownership tests
    const testUser2 = {
      email: "alertsteste2@exemplo.com",
      password: "Password123",
      name: "Test User 2",
    };

    const created = await request(app).post("/users/register").send(testUser);
    userId = created.body.id_user;
    const created2 = await request(app).post("/users/register").send(testUser2);
    userId2 = created2.body.id_user;

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
        address: "123 Alerts Test Street",
        pc: "3123487",
        location: "Alerts City",
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
        address: "123 Alerts Test Street 2",
        pc: "2123356",
        location: "Alerts City 2",
        building_type: "studio",
        id_supplier: 2,
        custom_supplier_price: 0.3,
      });
    houseId2 = res4.body.data.id_housing;

    // Create equipments
    const equipmentRes = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        energy_type: 1,
        capacity: 100,
        housing: id_housing,
        name: "Test Equipment",
      });
    id_equipment1 = equipmentRes.body.id_equipment;

    const equipmentRes2 = await request(app)
      .post("/energy-equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        energy_type: 1,
        capacity: 50,
        housing: houseId2,
        name: "Test Equipment",
      });
    id_equipment2 = equipmentRes2.body.id_equipment;
  });

  test("/PATCH /users/:id_user - should activate alerts and define their tresholds", async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        notification_settings: {
          alerts: true,
          frequency: "instant",
          thresholds: { consumption: 0.4, production: "0.5", cost: 10 },
        },
      });
    expect(res.statusCode).toBe(204);
  });

  test("/POST /energy-productions - should add energy production and an alert", async () => {
    const res = await request(app)
      .post("/energy-productions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_equipment: id_equipment1,
        date: Date.now(),
        value: 0.2,
      });
    expect(res.statusCode).toBe(201);
  });

  test("POST /energy-consumptions - should add a new energy consumption and an alert", async () => {
    const res = await request(app)
      .post(`/energy-consumptions`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        value: 1.05,
        date: Date.now(),
        id_housing,
      });
    expect(res.statusCode).toBe(201);
  });

  test("/GET /notifications/mine - should get all the user notifications", async () => {
    const res = await request(app)
      .get(`/notifications/mine`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    id_notification = res.body.data[0].id_notification; // Store the first notification ID for deletion test
  });

  test("/DELETE /notifications/:id_notification - should fail deleting a notification that doesnt exist", async () => {
    const deleteRes = await request(app)
      .delete(`/notifications/${id_notification + 3}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(deleteRes.statusCode).toBe(404);
  });

  test("/DELETE /notifications/:id_notification - should delete a notification by ID", async () => {
    const deleteRes = await request(app)
      .delete(`/notifications/${id_notification}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(204);
  });

  afterAll(async () => {
    // Clean test data
    await User.destroy({ where: { email: "alertsteste@exemplo.com" } }); // This will also delete the housing due to cascading
    await User.destroy({ where: { email: "alertsteste2@exemplo.com" } });
    await app.sequelize.close();
  });
});
