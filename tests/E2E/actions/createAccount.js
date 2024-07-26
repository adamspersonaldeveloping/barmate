const chalk = require("chalk");

class createAccount {
  constructor(page) {
    this.url = "http://127.0.0.1:8000";
    this.page = page;
    this.signupBtn = "#signupBtn"; //might need to take out @
    this.signupBody = "#signupBody";
    this.usernameField = "#userName";
    this.userEmailField = "#exampleInputEmail1";
    this.passwordField = "#password";
    this.confirmPasswordField = "#confirmPassword";
    this.loginPageBtn = "#loginBtn";
    this.signupPageBtn = "#signupPageBtn";
  }

  async signup(userEmail, username, password, confirmPassword) {
    try {
      await this.page.goto(this.url);
      await this.page.waitForSelector(this.signupBtn);
      await this.page.click(this.signupBtn);
      //wait for the signupBody on the signup page to load
      await this.page.waitForSelector(this.signupBody);

      //type type the login credentials into the input fields
      await this.page.type(this.usernameField, username, { delay: 100 });
      //   await this.page.setTimeout(1000);
      await this.page.type(this.userEmailField, userEmail, { delay: 100 });
      //   await this.page.waitFor(1000);
      await this.page.type(this.passwordField, password, { delay: 100 });
      //   await this.page.setTimeout(1000);
      await this.page.type(this.confirmPasswordField, confirmPassword, {
        delay: 100,
      });
      //   await this.page.setTimeout(1000);

      //Click the create account button
      await this.page.click(this.signupPageBtn);

      //wait for the user profile to load
      await this.page.waitForSelector("#profilePageTest");
      //   await this.page.setTimeout(2000);

      const userEmailFromProfile = await this.page.$eval(
        "#profilePageUserEmail",
        (el) => el.textContent
      );
      return userEmailFromProfile;
    } catch (err) {
      console.log(chalk.red("ERROR => ", err));
    }
  }
}

module.exports = (page) => new createAccount(page);
