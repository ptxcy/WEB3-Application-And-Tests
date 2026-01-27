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

test('Create Non Admin Account an check if only create Application Button is Left', async () => {
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const openUserManagementPageButton = await driver.findElement(
      By.css('#OpenUserManagementPageButton'),
    );
    await openUserManagementPageButton.click();
    await driver.sleep(300);

    const createUserButton = await driver.findElement(
      By.css('#UserManagementPageCreateUserButton'),
    );
    await createUserButton.click();
    await driver.sleep(300);

    const usernameInput = await driver.findElement(By.css('#CreateUserComponentEditUserID'));
    const firstNameInput = await driver.findElement(By.css('#CreateUserComponentEditFirstName'));
    const lastNameInput = await driver.findElement(By.css('#CreateUserComponentEditLastName'));
    const passwordInput = await driver.findElement(By.css('#CreateUserComponentEditPassword'));
    const createButton = await driver.findElement(By.css('#CreateUserComponentCreateUserButton'));

    await usernameInput.sendKeys('newUser');
    await firstNameInput.sendKeys('New');
    await lastNameInput.sendKeys('User');
    await passwordInput.sendKeys('Xc7@bY5!nR2#tK9q');
    await createButton.click();
    await driver.sleep(300);

    await logIn(driver, 'newUser', 'Xc7@bY5!nR2#tK9q');
    const heading = await driver.findElement(By.css('h1'));
    expect(await heading.getText()).toBe('Starting Page');

    const openDegreeCourseManagmentPageButton = await driver.findElement(
      By.css('#OpenDegreeCourseManagementPageButton'),
    );
    await openDegreeCourseManagmentPageButton.click();
    await driver.sleep(300);

    await expect(async () => {
      await driver.findElement(By.css('#DegreeCourseManagementPageCreateDegreeCourseButton'));
    }).rejects.toThrow();
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});
