const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

describe("User related tests", () => {
  let token = "";
  let id_user = "";
  let id_user2 = "";

  beforeAll(async () => {
    // Create a test user
    const testUser = {
      email: "usersteste@exemplo.com",
      password: "Password123",
      name: "Test User",
    };
    // Create a second test user for ownership tests
    const testUser2 = {
      email: "usersteste2@exemplo.com",
      password: "Password123",
      name: "Test User 2",
    };

    const created = await request(app).post("/users/register").send(testUser);
    const created2 = await request(app).post("/users/register").send(testUser2);

    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    token = res.body.accessToken; // Store the token for authenticated requests
    id_user = res.body.user.id_user; // Store the user ID for further tests
    id_user2 = created2.body.id_user; // Store the second user's ID for ownership tests
  });

  test("PATCH /users/:id_user - update user info", async () => {
    const res = await request(app)
      .patch(`/users/${id_user}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
      });

    expect(res.statusCode).toBe(204);
  });

  test("PATCH /users/:id_user - should fail when trying to update another user info", async () => {
    const res = await request(app)
      .patch(`/users/${id_user2}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  test("PATCH /users/:id_user/changePassword - update user password", async () => {
    const res = await request(app)
      .patch(`/users/${id_user}/changePassword`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Password123",
        newPassword: "NewPassword123",
      });

    expect(res.statusCode).toBe(204);
  });

  test("PATCH /users/:id_user/changePassword - should fail when updating user password with wrong current password provided", async () => {
    const res = await request(app)
      .patch(`/users/${id_user}/changePassword`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "WrongPassword",
        newPassword: "NewPassword123",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Invalid current password");
  });

  test("GET /users/:id_user/widgets - fetch user's widgets", async () => {
    const res = await request(app)
      .get(`/users/${id_user}/widgets`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("widgets");
    expect(Array.isArray(res.body.data.widgets)).toBe(true);
  });

  test("GET /users/:id_user/widgets - should fail fetching another user's widgets", async () => {
    const res = await request(app)
      .get(`/users/${id_user2}/widgets`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  test("GET /users/:id_user/housings - fetch user's housings", async () => {
    const res = await request(app)
      .get(`/users/${id_user}/housings`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("houses");
    expect(Array.isArray(res.body.data.houses)).toBe(true);
  });

  test("GET /users/:id_user/housings - should fail fetching another user's housings", async () => {
    const res = await request(app)
      .get(`/users/${id_user2}/housings`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  afterAll(async () => {
    // Clean test data
    await User.destroy({ where: { email: "usersteste@exemplo.com" } });
    await User.destroy({ where: { email: "usersteste2@exemplo.com" } });
  });
});
