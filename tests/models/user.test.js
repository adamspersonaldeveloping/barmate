const User = require("../../models/User");
const ObjectId = require("mongodb").ObjectId;

describe("User should be created", () => {
  //create a new test comment
  const newUser = new User({
    userName: "Bob",
    email: "Bob@bob.com",
    favorites: [
      "6332ba278709f1647ad5cd58",
      "6332ba278709f1647ad5cd5e",
      "6332ba278709f1647ad5cd60",
    ],
    password: "bob1234",
  });

  //check that the _id is a valid Mongodb ObjectId
  it("should have a valid MongoDb ObjectId", () => {
    expect(ObjectId.isValid(newUser._id)).toBeTruthy();
  });

  it('should have the userName of "Bob"', () => {
    expect(newUser.userName).toBe("Bob");
  });

  //check email is valid using regex

  it("should be a valid email", () => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    expect(emailRegex.test(newUser.email)).toBeTruthy();
  });
  //check if favorites is an array
  it("favorites is an array", () => {
    expect(Object.prototype.toString.call(newUser.favorites)).toBe(
      "[object Array]"
    );
  });
  it("check each favorite as a valid ObjectId", () => {
    function isValid(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (ObjectId.isValid(arr[i])) {
          continue;
        } else {
          return false;
        }
      }
      return true;
    }
    expect(isValid(newUser.favorites)).toBeTruthy();
  });

  //check password is valid
  it("should be valid password", () => {
    expect(newUser.password).toBe("bob1234");
  });
});
