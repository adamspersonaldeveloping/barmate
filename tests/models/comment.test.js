//testing post to database and model

const comments = require("../../controllers/comments");
const Comment = require("../../models/Comment");
const connectDB = require("../../config/database");
const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");
require("dotenv").config({ path: "./config/.env" });

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Check createComment and deleteComment functions exists", () => {
  it("createComment shoud exist", () => {
    expect(comments.createComment).toBeDefined();
  });
  it("deleteComment shoud exist", () => {
    expect(comments.deleteComment).toBeDefined();
  });
});

describe("write a forum post to the database", () => {
  test("should save new comment to DB", async () => {
    const newPostedComment = new Comment({
      comment: "testing posting a comment",
      forumPost: "6333cde95d343f0034ee0ee3",
      user: "6332f844f65e4f0032f10f55",
      userName: "tester Bob",
    });

    const savedComment = await newPostedComment.save();
    expect(ObjectId.isValid(newPostedComment._id)).toBeTruthy();
    expect(newPostedComment.comment).toBe("testing posting a comment");
    expect(ObjectId.isValid(newPostedComment.forumPost)).toBeTruthy();
    expect(ObjectId.isValid(newPostedComment.user)).toBeTruthy();
    expect(newPostedComment.userName).toBe("tester Bob");

    await Comment.deleteOne({
      _id: savedComment._id,
    });
  });
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
