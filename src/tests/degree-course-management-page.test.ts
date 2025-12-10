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
/* FIX LATER
test('Create / Edit / Delete Course as Admin', async () => {
  const username = 'admin';
  const password = '123';
  await logIn(driver, username, password);

  try {
    const openDegreeCourseManagmentPageButton = await driver.findElement(
      By.css('#OpenDegreeCourseManagementPageButton'),
    );
    await openDegreeCourseManagmentPageButton.click();
    await driver.sleep(300);

    const createCourseButton = await driver.findElement(
      By.id('DegreeCourseManagementPageCreateDegreeCourseButton'),
    );
    await createCourseButton.click();
    await driver.sleep(300);

    await driver.findElement(By.id('CreateDegreeCourseComponentEditName')).sendKeys('Informatik');
    await driver.findElement(By.id('CreateDegreeCourseComponentEditShortName')).sendKeys('INFO');
    await driver
      .findElement(By.id('CreateDegreeCourseComponentEditUniversityName'))
      .sendKeys('Technische Universität Berlin');
    await driver
      .findElement(By.id('CreateDegreeCourseComponentEditUniversityShortName'))
      .sendKeys('TUB');
    await driver
      .findElement(By.id('CreateDegreeCourseComponentEditDepartmentName'))
      .sendKeys('Fakultät für Informatik');
    await driver
      .findElement(By.id('CreateDegreeCourseComponentEditDepartmentShortName'))
      .sendKeys('FI');

    const submitCreate = await driver.findElement(
      By.id('CreateDegreeCourseComponentCreateDegreeCourseButton'),
    );
    await submitCreate.click();
    await driver.sleep(500);

    const courseList = await driver.findElement(By.id('DegreeCourseManagementPageListComponent'));
    const newCourseItem = await courseList.findElement(
      By.xpath(".//div[contains(@class,'course-card') and .//p[contains(., 'Informatik')]]"),
    );
    expect(newCourseItem).toBeDefined();

    const editButton = await newCourseItem.findElement(
      By.css("button[id^='DegreeCourseItemEditButton']"),
    );
    await editButton.click();
    await driver.sleep(500);

    const editNameInput = await driver
      .findElement(By.id('EditDegreeCourseComponentEditName'))
      .findElement(By.tagName('input'));
    await editNameInput.clear();
    await editNameInput.sendKeys('Informatik Updated');

    const saveEdit = await driver.findElement(
      By.id('EditDegreeCourseComponentSaveDegreeCourseButton'),
    );
    await saveEdit.click();
    await driver.sleep(500);

    const updatedCourseItem = await courseList.findElement(
      By.xpath(
        ".//div[contains(@class,'course-card') and .//p[contains(., 'Informatik Updated')]]",
      ),
    );
    expect(updatedCourseItem).toBeDefined();

    const deleteButton = await updatedCourseItem.findElement(
      By.css("button[id^='DegreeCourseItemDeleteButton']"),
    );
    await deleteButton.click();
    const deleteDialog = await driver.findElement(By.css("div[id^='DeleteDialogDegreeCourse']"));
    const confirmDeleteButton = await deleteDialog.findElement(
      By.css("button[id^='DegreeCourseItemDeleteButton']"),
    );
    await confirmDeleteButton.click();
    await driver.sleep(500);

    const deleted = await courseList.findElements(
      By.xpath(".//div[contains(text(),'Informatik Updated')]"),
    );
    expect(deleted.length).toBe(0);
  } catch (err) {
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    console.error('Browser logs during failed test:');
    logs.forEach((entry) => console.error(`[${entry.level.name}] ${entry.message}`));
    throw err;
  }
});
*/

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
