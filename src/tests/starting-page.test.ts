import { WebDriver, Builder, By, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { logIn } from '../util/DriverHelper.ts';

let driver: WebDriver;

beforeAll(async () => {
  const options = new chrome.Options();

  /* Logging */
  const prefs = new logging.Preferences();
  prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--allow-insecure-localhost');
  options.setLoggingPrefs(prefs);
  driver = await new Builder().usingServer('http://selenium:4444/wd/hub').forBrowser('chrome').setChromeOptions(options).build();
});

afterAll(async () => {
  await driver.quit();
});

test('Test Backend Access', async () => {
  await driver.get('http://frontend');
});

test('LogIn with correct Credentials and check if Start Page is Showing', async () => {
  //TODO MAKE SAVE LATER WHEN PIPELINING IS ADDED
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const heading = await driver.findElement(By.css('h1'));
    expect(await heading.getText()).toBe('Starting Page');
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});

test('LogIn with false Credentials and check if Landing Page is Showing', async () => {
  const username = 'RandomNameNobodyWouldUse';
  const password = 'ShouldNotMatterJustRandom';
  await logIn(driver, username, password);
  const heading = await driver.findElement(By.css('h1'));
  expect(await heading.getText()).toBe('Landing Page');
});
