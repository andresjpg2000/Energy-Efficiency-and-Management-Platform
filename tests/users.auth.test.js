// Jest test suite for user authentication with and without two factor authentication

// Mock the mailSender to avoid sending real emails during tests
jest.mock("../server/mailSender.js", () => ({
  send2FACodeEmail: jest.fn().mockResolvedValue(true),
}));

const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");
// This is where the two factor codes are stored, in the future use a real database
const {
  twoFactorCodes,
} = require("../server/controllers/users.auth.controller.js");

beforeAll(async () => {
  // setup code
});

describe("Authentication tests (without two factor authentication enabled)", () => {
  let token = "";
  let refreshToken = "";

  const testUser = {
    email: "authteste@exemplo.com",
    password: "Password123",
    name: "Test User",
  };

  test("POST /users/register - should register a new user", async () => {
    const res = await request(app).post("/users/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  test("User registration with existing email", async () => {
    const res = await request(app).post("/users/register").send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Email already exists");
  });

  test("Login with empty email field", async () => {
    const res = await request(app).post("/users/login").send({
      email: "",
      password: testUser.password,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Email and password are required");
  });

  test("Login with wrong password", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: "WrongPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Invalid password");
  });

  test("POST /users/login - should login user", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    token = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test("POST /users/refresh-token - should use refresh token to generate new access token", async () => {
    const res = await request(app)
      .post("/users/refresh-token")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    token = res.body.accessToken;
  });
});

describe("Authentication tests (with two factor authentication enabled)", () => {
  let tempToken = "";
  let accessToken = "";
  let refreshToken = "";
  let twoFactorCode = "";

  const testUser2FA = {
    email: "usercom2fa@email.com",
    password: "Password123",
  };

  test("POST /users/login - should return a 2FA tempToken and send code to user email", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser2FA.email,
      password: testUser2FA.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Two factor authentication link sent to your email",
    );
    expect(res.body).toHaveProperty("tempToken");
    expect(res.body.user.two_factor_enabled).toBe(true);

    tempToken = res.body.tempToken;

    // Make sure code was generated and stored
    const user = await User.findOne({ where: { email: testUser2FA.email } });
    const code = twoFactorCodes.get(user.id_user);
    expect(code).toBeDefined();

    twoFactorCode = code;
  }, 10000);

  test("POST /users/verify-2fa - should verify 2FA with correct code and tempToken", async () => {
    const res = await request(app).post("/users/verify-2fa").send({
      token: tempToken,
      code: twoFactorCode,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test("Reject reused 2FA code", async () => {
    const res = await request(app).post("/users/verify-2fa").send({
      token: tempToken,
      code: twoFactorCode,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid two factor authentication code");
  });
});

afterAll(async () => {
  // Clean test data
  await User.destroy({ where: { email: "authteste@exemplo.com" } });
  await app.sequelize.close(); // Close the database connection
});
