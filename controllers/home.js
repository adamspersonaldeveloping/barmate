const Post = require("../models/Post");
module.exports = {
  getIndex: async (req, res) => {
    const posts = await Post.find().lean();
    res.render("index.ejs", {posts: posts});
  },
};
