const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("Widgets tests", () => {
  let token = "";
  let userId;

  beforeAll(async () => {
    // Create and login test user
    const testUser = {
      email: "widgetsteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };

    const created = await request(app).post("/users/register").send(testUser);
    userId = created.body.id_user;

    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = res.body.accessToken;
  });

  let widgetTitle = "ConsumptionWidget";

  test("POST /widgets - should create a widget", async () => {
    const res = await request(app)
      .post("/widgets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_user: userId,
        title: widgetTitle,
        body: JSON.stringify({ x: 0, y: 0 }),
        type: "chart",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe(widgetTitle);
  });

  test("GET /users/id_user/widgets - should return user widgets", async () => {
    const resCheck = await request(app)
      .get(`/users/${userId}/widgets`)
      .set("Authorization", `Bearer ${token}`);

    expect(resCheck.statusCode).toBe(200);
    expect(
      resCheck.body.data.widgets.some((widget) => widget.title === widgetTitle),
    ).toBe(true);
  });

  test("PATCH /widgets/:title - should fail with extra fields", async () => {
    const res = await request(app)
      .patch(`/widgets/${widgetTitle}`)
      .query({ id_user: userId })
      .send({ x: 1, y: 2, invalidField: true });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Only x and y fields are allowed");
  });

  test("DELETE /widgets/:title - should delete the widget", async () => {
    const res = await request(app)
      .delete(`/widgets/${widgetTitle}`)
      .set("Authorization", `Bearer ${token}`)
      .query({ id_user: userId });
    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    await User.destroy({ where: { email: "widgetsteste@exemplo.com" } });
    await app.sequelize.close();
  });
});
