const Post = require("../../models/Post");
const post = require("../../models/Post");
const ObjectId = require("mongodb").ObjectId;

describe("Post Should be created", () => {
  const newPost = new Post({
    cocktailName: "test cocktailName",
    ingredients: ["ingredient1", "ingredient2", "ingredient3"],
    method: "test method",
    garnish: "test garnish",
    note: "test note",
    image: "test image",
    cloudinaryId: "test Id",
    ibaCocktail: true,
    public: true,
  });
  it("should have a valid MongoDb ObjectId", () => {
    expect(ObjectId.isValid(newPost._id)).toBeTruthy();
  });

  it('should have the name "test cocktailName"', () => {
    expect(newPost.cocktailName).toBe("test cocktailName");
  });

  it("should have an Array for ingredients", () => {
    expect(Object.prototype.toString.call(newPost.ingredients)).toBe(
      "[object Array]"
    );
  });

  it('should contain the ingredients "ingredient1", "ingredient2", "ingredient3"', () => {
    expect(newPost.ingredients).toContain("ingredient1");
    expect(newPost.ingredients).toContain("ingredient2");
    expect(newPost.ingredients).toContain("ingredient3");
  });
  it('should have the method "test method"', () => {
    expect(newPost.method).toBe("test method");
  });
  it('should have the garnish "test garnish"', () => {
    expect(newPost.garnish).toBe("test garnish");
  });
  it('should have the note "test note"', () => {
    expect(newPost.note).toBe("test note");
  });
  it('should have the image "test image"', () => {
    expect(newPost.image).toBe("test image");
  });
  it('should have the cloudinaryId "test Id"', () => {
    expect(newPost.cloudinaryId).toBe("test Id");
  });
  it("should have a boolean value of true for ibaCocktail", () => {
    expect(newPost.ibaCocktail).toBeTruthy();
  });
  it("should have a boolean value of true for public", () => {
    expect(newPost.public).toBeTruthy();
  });
  it("should have a valid Date", () => {
    expect(newPost.createdAt).toBeInstanceOf(Date);
  });
});
