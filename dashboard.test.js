// Require modules used in the logic below
const { Builder, By, Key, until } = require("selenium-webdriver");
require("dotenv").config();

// Get environment variables
const { BASE_URL, DASH_USER, DASH_PASSWORD } = process.env;

require("chromedriver");
const driver = new Builder().forBrowser("chrome").build();

// Adjust this value if you find our tests failing due to timeouts.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;

// Login to dashboard css
const login = async () => {
  // Define login elements
  let btnLogin = By.css("button.submit");
  let inpUsername = By.css("#UserName");
  let inpPassword = By.css("#LoginUserPassword");

  const enterCredentialsAndLogin = async () => {
    console.log("Entering credentials...");
    // Wait until an input element appears
    await driver.wait(until.elementLocated(inpUsername), 10 * 1000);
    // Enter credentials and log in
    await driver.findElement(inpUsername).sendKeys(DASH_USER);
    await driver.findElement(inpPassword).sendKeys(DASH_PASSWORD);
    await driver.findElement(btnLogin).click();
  };

  // Load the login page
  await driver.get(BASE_URL);

  // Wait until the page is loaded
  await driver.wait(until.elementLocated(btnLogin), 10 * 1000);
  console.log("Login screen loaded.");

  await enterCredentialsAndLogin();

  // Wait to be logged in, assuming it was was successful
  // once the Log in button has gone "stale."
  //   await driver.wait(until.stalenessOf(driver.findElement(btnLogin)));
  console.log("Logged in.");
};

// Define a category of tests using test framework, in this case Jasmine
describe("Layout tests", () => {
  // Before every test, open a browser and login
  // using the logic written above.
  beforeEach(async function () {
    await login();
    console.log("Test beginning.");
  });
  // After each test, close the browser.
  afterAll(async function () {
    await driver.quit();
  });

  // Verify dashboard laoded successfully
  it("Dashboard loaded correctly", async () => {
    // Provide basic data used to evaluate the test.
    // This test should pass.
    let testData = {
      pageName: "Dashboard.Gate CMS Portal",
      navBarTop: By.css("#portal-header"),
      heroMessage: By.css(".masterHead"),
    };
    console.log("Running test...");

    // Preview the test page
    await driver.get(BASE_URL);

    await driver.getTitle();

    // Wait for navbar
    await driver.wait(until.elementLocated(testData.navBarTop), 10 * 1000);

    // Verify navbar is present
    expect(await driver.findElement(testData.navBarTop).isDisplayed()).toBe(
      true
    );

    // Click button
    expect(await driver.findElement(testData.heroMessage).getText()).toBe(
      testData.pageName
    );
  });
});
