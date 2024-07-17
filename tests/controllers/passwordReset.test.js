const password = require("../../controllers/passwordReset");

describe("check if password is valid", () => {
  //mock passwords
  const allNums = {
    body: {
      password: "12345678",
      confirmPassword: "12345678",
    },
    params: {
      token: "12345678",
    },
  };
  const tooShort = {
    body: {
      password: "156aA",
      confirmPassword: "156aA",
    },
    params: {
      token: "12345678",
    },
  };
  const noMatch = {
    body: {
      password: "12345678aA",
      confirmPassword: "123456789bB",
    },
    params: {
      token: "12345678",
    },
  };
  const noLower = {
    body: {
      password: "1234567A",
      confirmPassword: "1234567A",
    },
    params: {
      token: "12345678",
    },
  };
  const noUpper = {
    body: {
      password: "1234567a",
      confirmPassword: "1234567a",
    },
    params: {
      token: "12345678",
    },
  };
  const tooLong = {
    body: {
      password: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123",
      confirmPassword:
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123",
    },
    params: {
      token: "12345678",
    },
  };
  const noNums = {
    body: {
      password: "aaaaAAAA",
      confirmPassword: "aaaaAAAA",
    },
    params: {
      token: "12345678",
    },
  };
  const noRequirements = {
    body: {
      password: ".",
      confirmPassword: ".",
    },
    params: {
      token: "12345678",
    },
  };
  const crazySpecialChars = {
    body: {
      password: ".+-*/=_)(*&^%$#@!<>?{}|][:;/,`~1aA",
      confirmPassword: ".+-*/=_)(*&^%$#@!<>?{}|][:;/,`~1aA",
    },
    params: {
      token: "12345678",
    },
  };
  const crazySpecialCharsWithBackSlash = {
    body: {
      password: ".+-*/=_)(*&^%$#@!<>?{}|][:;/,`~1aA\\",
      confirmPassword: ".+-*/=_)(*&^%$#@!<>?{}|][:;/,`~1aA\\",
    },
    params: {
      token: "12345678",
    },
  };
  const goodPass = {
    body: {
      password: "1234567aA",
      confirmPassword: "1234567aA",
    },
    params: {
      token: "12345678",
    },
  };

  //tests

  it("should pass all tests", () => {
    expect(password.isPasswordValid(goodPass)).toBeTruthy();
  });

  it("should check that password as an upper and lower case letter", () => {
    const alerts = password.isPasswordValid(allNums);
    expect(alerts).toContainEqual(
      expect.objectContaining({
        msg: "PASSWORD MUST HAVE AT LEAST 1 UPPERCASE LETTER",
      })
    );
    expect(alerts).toContainEqual(
      expect.objectContaining({
        msg: "password must have at least 1 lowercase letter",
      })
    );
  });

  it("should check password is at least 8 characters long", () => {
    expect(password.isPasswordValid(tooShort)).toContainEqual(
      expect.objectContaining({
        msg: "Password must be at least 8 characters long",
      })
    );
  });

  it("should check that passwords match", () => {
    expect(password.isPasswordValid(noMatch)).toContainEqual(
      expect.objectContaining({
        msg: "Passwords do not match",
      })
    );
  });

  it("should check that password has a lowercase letter", () => {
    expect(password.isPasswordValid(noLower)).toContainEqual(
      expect.objectContaining({
        msg: "password must have at least 1 lowercase letter",
      })
    );
  });

  it("should check that password has uppercase letter", () => {
    expect(password.isPasswordValid(noUpper)).toContainEqual(
      expect.objectContaining({
        msg: "PASSWORD MUST HAVE AT LEAST 1 UPPERCASE LETTER",
      })
    );
  });

  it("should check that password has less than 32 characters", () => {
    expect(password.isPasswordValid(tooLong)).toContainEqual(
      expect.objectContaining({
        msg: "Password must NOT be more than 32 characters long",
      })
    );
  });

  it("should check that password has at least 1 number", () => {
    expect(password.isPasswordValid(noNums)).toContainEqual(
      expect.objectContaining({
        msg: "Pa55w0rd mu57 4av3 a7 l3ast 1 numb3r",
      })
    );
  });

  it("should check that password has a number, lower and upper case letter, and at least 8 characters length", () => {
    const alerts = password.isPasswordValid(noRequirements);
    expect(alerts).toContainEqual(
      expect.objectContaining({
        msg: "Pa55w0rd mu57 4av3 a7 l3ast 1 numb3r",
      })
    );
    expect(alerts).toContainEqual(
      expect.objectContaining({
        msg: "password must have at least 1 lowercase letter",
      })
    );
    expect(alerts).toContainEqual(
      expect.objectContaining({
        msg: "PASSWORD MUST HAVE AT LEAST 1 UPPERCASE LETTER",
      })
    );
    expect(alerts).toContainEqual(
      expect.objectContaining({
        msg: "Password must be at least 8 characters long",
      })
    );
  });

  it("should pass all tests even with crazy characters", () => {
    expect(password.isPasswordValid(crazySpecialChars)).toBeTruthy();
  });

  it("should pass all tests even with backslashes \\", () => {
    expect(
      password.isPasswordValid(crazySpecialCharsWithBackSlash)
    ).toBeTruthy();
  });
});
