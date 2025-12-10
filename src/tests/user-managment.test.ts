import { WebDriver, Builder, By, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { logIn } from '../util/DriverHelper.ts';

let driver: WebDriver;

beforeAll(async () => {
  const options = new chrome.Options();

  /* Logging */
  const prefs = new logging.Preferences();
  prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    options.addArguments(
        '--headless=new',
        '--disable-gpu',
        '--ignore-certificate-errors',
        '--allow-insecure-localhost',
        '--disable-web-security',
        '--user-data-dir=/tmp/chrome-profile'
    );
  options.setLoggingPrefs(prefs);
  driver = await new Builder().usingServer('http://selenium:4444/wd/hub').forBrowser('chrome').setChromeOptions(options).build();
});

afterAll(async () => {
  await driver.quit();
});

test('Check if Admin is Listed in the User Management page', async () => {
  //TODO MAKE SAVE LATER WHEN PIPELINING IS ADDED
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const openUserManagementPageButton = await driver.findElement(
      By.css('#OpenUserManagementPageButton'),
    );
    await openUserManagementPageButton.click();
    await driver.findElement(By.css('#UserItemadmin'));
    // no error means elements exist
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});

test('Check if Admin can create a user and if new user is listed directly', async () => {
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const openUserManagementPageButton = await driver.findElement(
      By.css('#OpenUserManagementPageButton'),
    );
    await openUserManagementPageButton.click();

    const createUserButton = await driver.findElement(
      By.css('#UserManagementPageCreateUserButton'),
    );
    await createUserButton.click();

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
    await driver.findElement(By.css('#UserItemnewUser'));
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});

test('Check if created user can be used to logIn and not see the user management page', async () => {
  const username = 'newUser';
  const password = 'Xc7@bY5!nR2#tK9q';
  await logIn(driver, username, password);
  try {
    const heading = await driver.findElement(By.css('h1'));
    expect(await heading.getText()).toBe('Starting Page');
    await expect(async () => {
      await driver.findElement(By.css('#OpenUserManagementPageButton'));
    }).rejects.toThrow();
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});

test('Check if Admin can edit a user', async () => {
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const openUserManagementPageButton = await driver.findElement(
      By.css('#OpenUserManagementPageButton'),
    );
    await openUserManagementPageButton.click();
    let adminItem = await driver.findElement(By.css('#UserItemadmin'));
    let editButton = adminItem.findElement(By.css('#UserItemEditButtonadmin'));
    await editButton.click();
    await driver.sleep(300);

    let firstNameInput = await driver.findElement(By.css('#EditUserComponentEditFirstName'));
    let lastNameInput = await driver.findElement(By.css('#EditUserComponentEditLastName'));
    let saveButton = await driver.findElement(By.css('#EditUserComponentSaveUserButton'));

    await firstNameInput.clear();
    await firstNameInput.sendKeys('ad');

    await lastNameInput.clear();
    await lastNameInput.sendKeys('min');

    await saveButton.click();
    await driver.sleep(500);

    adminItem = await driver.findElement(By.css('#UserItemadmin'));
    const newFirstNameInput = await adminItem.findElement(By.css('#FirstName'));
    const newLastNameInput = await adminItem.findElement(By.css('#LastName'));

    expect(await newFirstNameInput.getText()).toBe('ad');
    expect(await newLastNameInput.getText()).toBe('min');

    //Clean Up
    editButton = adminItem.findElement(By.css('#UserItemEditButtonadmin'));
    await editButton.click();
    firstNameInput = await driver.findElement(By.css('#EditUserComponentEditFirstName'));
    lastNameInput = await driver.findElement(By.css('#EditUserComponentEditLastName'));
    saveButton = await driver.findElement(By.css('#EditUserComponentSaveUserButton'));

    await firstNameInput.clear();
    await firstNameInput.sendKeys('Unknown');
    await lastNameInput.clear();
    await lastNameInput.sendKeys('Unknown');
    await saveButton.click();
    await driver.sleep(200);
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});

test('Create Already existent User', async () => {
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const openUserManagementPageButton = await driver.findElement(
      By.css('#OpenUserManagementPageButton'),
    );
    await openUserManagementPageButton.click();

    const createUserButton = await driver.findElement(
      By.css('#UserManagementPageCreateUserButton'),
    );
    await createUserButton.click();

    const usernameInput = await driver.findElement(By.css('#CreateUserComponentEditUserID'));
    const firstNameInput = await driver.findElement(By.css('#CreateUserComponentEditFirstName'));
    const lastNameInput = await driver.findElement(By.css('#CreateUserComponentEditLastName'));
    const passwordInput = await driver.findElement(By.css('#CreateUserComponentEditPassword'));
    const createButton = await driver.findElement(By.css('#CreateUserComponentCreateUserButton'));

    await usernameInput.sendKeys('newUser');
    await firstNameInput.sendKeys('abc');
    await lastNameInput.sendKeys('cba');
    await passwordInput.sendKeys('Xc7@bY5!nR2#tK9q');
    await createButton.click();

    //Check if Dialog is still Open because it is not accepting wrong input (password input should still be there)
    await driver.findElement(By.css('#CreateUserComponentEditPassword'));
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});

test('Check if Admin can delete a user', async () => {
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const openUserManagementPageButton = await driver.findElement(
      By.css('#OpenUserManagementPageButton'),
    );
    await openUserManagementPageButton.click();
    await driver.findElement(By.css('#UserItemnewUser'));
    const deleteButton = await driver.findElement(By.css('#UserItemDeleteButtonnewUser'));
    await deleteButton.click();
    await driver.sleep(200);
    const confirmButton = await driver.findElement(By.css('#DeleteDialogConfirmButton'));
    await confirmButton.click();
    await driver.sleep(200);

    await expect(async () => {
      await driver.findElement(By.css('#UserItemnewUser'));
    }).rejects.toThrow();
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});

test('Wrongly Create User', async () => {
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);
  try {
    const openUserManagementPageButton = await driver.findElement(
      By.css('#OpenUserManagementPageButton'),
    );
    await openUserManagementPageButton.click();

    const createUserButton = await driver.findElement(
      By.css('#UserManagementPageCreateUserButton'),
    );
    await createUserButton.click();

    const passwordInput = await driver.findElement(By.css('#CreateUserComponentEditPassword'));
    const createButton = await driver.findElement(By.css('#CreateUserComponentCreateUserButton'));

    await passwordInput.sendKeys('Xc7@bY5!nR2#tK9q');
    await createButton.click();

    //Check if Dialog is still Open because it is not accepting wrong input (password input should still be there)
    await driver.findElement(By.css('#CreateUserComponentEditPassword'));
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});
