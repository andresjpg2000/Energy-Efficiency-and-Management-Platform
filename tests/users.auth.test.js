const request = require("supertest");
const app = require("../server/server"); // importa a tua instância do Express

describe("🧪 Autenticação - Registo, Login e Perfil", () => {
  let token = "";

  const testUser = {
    email: "teste@exemplo.com",
    password: "Password123",
    name: "Utilizador Teste",
  };

  test("Registo de novo utilizador", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  test("Login do utilizador", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Obter perfil do utilizador autenticado", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", testUser.email);
  });
});
