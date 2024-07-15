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
