let credentials = require("../utils/credentials"); //might have to change these to const
let createAccount = require("../actions/createAccount"); // might change to const

jest.setTimeout(60000); //override jest autotimeout of 5 seconds due to browsers taking more time to test

describe("Basic Authentication e2e tests", () => {
  let credential;
  beforeAll(async () => {
    //set a definite size for the page viewpoet so view is consistent across browsers
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });

    credential = credentials("User");
    console.log(credential.email);
    createAccount = await createAccount(page);
  });

  it("Should be able to create an account", async () => {
    const email = await createAccount.signup(
      credential.userEmail,
      credential.username,
      credential.password,
      credential.confirmPassword
    );
    // page.setTimeout(1000); //might have to change this to setTimeout
    console.log(email);
    expect(email).toContain(`Email: ${credential.userEmail}`);
  }, 30000);
});
