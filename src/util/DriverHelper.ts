import { By, WebDriver } from 'selenium-webdriver';

export async function logIn(driver: WebDriver, username: string, password: string) {
  await driver.get('http://frontend/');
  const logInButton = await driver.findElement(By.css('#OpenLoginDialogButton'));
  await logInButton.click();

  const usernameInputElement = await driver.findElement(By.css('#LoginDialogUserIDText'));
  const passwordInputElement = await driver.findElement(By.css('#LoginDialogPasswordText'));
  const loginButton = await driver.findElement(By.css('#PerformLoginButton'));

  await usernameInputElement.sendKeys(username);
  await passwordInputElement.sendKeys(password);
  await loginButton.click();
  //Wait for the logIn process to complete
  await driver.sleep(300);
}
