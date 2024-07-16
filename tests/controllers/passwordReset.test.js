const password = require("../../controllers/passwordReset");

describe("check if password is valid", () => {
  const req1 = {
    body: {
      password: "12345678",
      confirmPassword: "12345678",
    },
    params: {
      token: "12345678",
    },
  };
  const req2 = {
    body: {
      password: "123456",
      confirmPassword: "123456",
    },
    params: {
      token: "12345678",
    },
  };
  const req3 = {
    body: {
      password: "12345678",
      confirmPassword: "123456789",
    },
    params: {
      token: "12345678",
    },
  };
  it("should check that password is more than 7 characters long", () => {
    expect(password.isPasswordValid(req1)).toBeTruthy();
  });
  it('should check that when password is not more than 7 characters long, the warning is "Password must be at least 8 characters long"', () => {
    expect(password.isPasswordValid(req2)).toBe(
      "Password must be at least 8 characters long"
    );
  });
  it('should check that passwords match "Passwords do not match"', () => {
    expect(password.isPasswordValid(req3)).toBe("Passwords do not match");
  });
});
