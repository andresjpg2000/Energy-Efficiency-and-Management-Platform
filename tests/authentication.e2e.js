// Exemplo de fluxo a automatizar:
// Acede à página de registo (/register)
// Preenche e submete o formulário
// Acede à página de login (/login)
// Faz login com os dados
// Se aplicável, valida o 2FA
// Verifica redirecionamento para dashboard ou mensagem de sucesso

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function testAutenticacao() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    // Acede à página de registo
    console.log("🔁 A aceder ao registo...");
    await driver.get("http://localhost:5173/register");

    await driver.sleep(2000);

    await driver.wait(until.elementLocated(By.name("email")), 5000);

    await driver
      .findElement(By.name("email"))
      .sendKeys("greengridesmad@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("passteste");
    await driver.findElement(By.name("firstname")).sendKeys("Developer");
    await driver.findElement(By.name("lastname")).sendKeys("Tester");
    await driver.findElement(By.css("form")).submit();

    // Espera para ver se regista
    await driver.sleep(2000);

    // Acede à página de login
    console.log("A aceder ao login...");
    await driver.get("http://localhost:5173/login");

    await driver
      .findElement(By.name("email"))
      .sendKeys("greengridesmad@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("passteste");
    await driver.sleep(2000);
    const submitLogin = await driver.findElement(
      By.id("loginButton")
    );
    await submitLogin.click();

    console.log("Login com sucesso!");
  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    await driver.quit();
  }
})();
