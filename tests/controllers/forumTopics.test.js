const forumTopics = require("../../controllers/forumTopics");
const Forum = require("../../models/Forum");
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

describe("Check get feed, get post, create post, and delete post functions exists", () => {
  it("getForumFeed shoud exist", () => {
    expect(forumTopics.getForumFeed).toBeDefined();
  });
  it("getForumPost shoud exist", () => {
    expect(forumTopics.getForumPost).toBeDefined();
  });
  it("createForumPost shoud exist", () => {
    expect(forumTopics.createForumPost).toBeDefined();
  });
  it("deleteForumPost shoud exist", () => {
    expect(forumTopics.deleteForumPost).toBeDefined();
  });
});

//this is not working as the method is calling render "cannot read properties of undefined(reading 'render')"
//gotForum is returning undefined
describe("check that getForumFeed will find a posts to the forum", () => {
  it("get forum", async () => {
    const gotForum = await forumTopics.getForumFeed();
    console.log(gotForum);
    expect(gotForum).toBeDefined();
  });
});
