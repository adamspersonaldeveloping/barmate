const { createComment } = require("../../controllers/forumTopics");
const forumPost = require("../../models/Forum");
const ObjectId = require("mongodb").ObjectId;

describe("Forum post should be created", () => {
  //create a new test comment
  const newForumPost = new forumPost({
    title: "this is a test title",
    message: "this is a test message",
    userName: "Bob",
  });
  //check forum title contents
  it('should have the title "this is a test title"', () => {
    expect(newForumPost.title).toBe("this is a test title");
  });
  //check comment contents
  it('should have the message "this is a test message"', () => {
    expect(newForumPost.message).toBe("this is a test message");
  });
  //check that the _id is a valid Mongodb ObjectId
  it("should have a valid MongoDb ObjectId", () => {
    expect(ObjectId.isValid(newForumPost._id)).toBeTruthy();
  });
  //check that the user name is the correct name
  it('should have the userName of "Bob"', () => {
    expect(newForumPost.userName).toBe("Bob");
  });
  //check that the date is valid
  it("should have a valid Date", () => {
    expect(newForumPost.createdAt).toBeInstanceOf(Date);
  });
});
