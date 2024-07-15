const { createComment } = require("../../controllers/comments");
const Comment = require("../../models/Comment");
const ObjectId = require("mongodb").ObjectId;

test("createComment function exists", () => {
  expect(createComment).toBeDefined();
});

describe("Comment should be created", () => {
  //create a new test comment
  const newComment = new Comment({
    comment: "this is a test comment",
    userName: "Bob",
  });
  //check comment contents
  it('should have the contents "this is a test comment"', () => {
    expect(newComment.comment).toBe("this is a test comment");
  });
  //check that the _id is a valid Mongodb ObjectId
  it("should have a valid MongoDb ObjectId", () => {
    expect(ObjectId.isValid(newComment._id)).toBeTruthy();
  });
  //check that the user name is the correct name
  it('should have the userName of "Bob"', () => {
    expect(newComment.userName).toBe("Bob");
  });
  //check that the date is valid
  it("should have a valid Date", () => {
    expect(newComment.createdAt).toBeInstanceOf(Date);
  });
});
