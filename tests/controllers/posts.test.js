const post = require("../../controllers/posts");

describe("Check getProfile, getFavorites, getFeed, getFeedIBA, getFeedNoIBA, getFeedZtoA, getFeedUnforgettables, getFeedNewEraDrinks, getPost, createPost, favoritePost, deleteFavorite, makePrivate, makePublic, deletePost", () => {
  it("getProfile shoud exist", () => {
    expect(post.getProfile).toBeDefined();
  });
  it("getFavorites shoud exist", () => {
    expect(post.getFavorites).toBeDefined();
  });
  it("getFeed shoud exist", () => {
    expect(post.getFeed).toBeDefined();
  });
  it("getFeedIBA shoud exist", () => {
    expect(post.getFeedIBA).toBeDefined();
  });
  it("getFeedNoIBA shoud exist", () => {
    expect(post.getFeedNoIBA).toBeDefined();
  });
  it("getFeedZtoA shoud exist", () => {
    expect(post.getFeedZtoA).toBeDefined();
  });
  it("getFeedUnforgettables shoud exist", () => {
    expect(post.getFeedUnforgettables).toBeDefined();
  });
  it("getFeedNewEraDrinks shoud exist", () => {
    expect(post.getFeedNewEraDrinks).toBeDefined();
  });
  it("getPost shoud exist", () => {
    expect(post.getPost).toBeDefined();
  });
  it("createPost shoud exist", () => {
    expect(post.createPost).toBeDefined();
  });
  it("favoritePost shoud exist", () => {
    expect(post.favoritePost).toBeDefined();
  });
  it("deleteFavorite shoud exist", () => {
    expect(post.deleteFavorite).toBeDefined();
  });
  it("makePrivate shoud exist", () => {
    expect(post.makePrivate).toBeDefined();
  });
  it("makePublic shoud exist", () => {
    expect(post.makePublic).toBeDefined();
  });
  it("deletePost shoud exist", () => {
    expect(post.deletePost).toBeDefined();
  });
});
