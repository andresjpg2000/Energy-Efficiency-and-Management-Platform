const request = require("supertest");
require("dotenv").config({ path: "./.env" });
const app = require("../server/app.js");
const { User } = require("../server/models/index.js");

beforeAll(async () => {
  // setup code
});

describe("🧪 Autenticação - Registo, Login e Perfil", () => {
  let token = "";

  const testUser = {
    email: "teste@exemplo.com",
    password: "Password123",
    name: "Utilizador Teste",
  };

  test("Registo de novo utilizador", async () => {
    const res = await request(app).post("/users/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  test("Login do utilizador", async () => {
    const res = await request(app).post("/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    token = res.body.accessToken;
  });
});

afterAll(async () => {
  // Clean test data
  await User.destroy({ where: { email: "teste@exemplo.com" } });
  await app.sequelize.close(); // Close the database connection
});
