import {WebDriver, Builder, By, logging} from 'selenium-webdriver';
import chrome from "selenium-webdriver/chrome";

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

test('Simple Test If the Landing Page is showing', async () => {
  await driver.get('http://frontend/');
  const heading = await driver.findElement(By.css('h1'));
  expect(await heading.getText()).toBe('Landing Page');
});
