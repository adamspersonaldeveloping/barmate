const cloudinary = require("../middleware/cloudinary");
const Forum = require("../models/Forum");
const Post = require("../models/Post")
const Comment = require("../models/Comment");


module.exports = {
 

  getForumFeed: async (req, res) => {
    try {
      const forumPosts = await Forum.find().sort({ createdAt: "desc" }).lean();
      res.render("forum.ejs", { ForumPosts: forumPosts });
    } catch (err) {
      console.log(err);
    }
  },
 
  getForumPost: async (req, res) => {
    try {
      const forumPost = await Forum.findById(req.params.id);
      const comments = await Comment.find({forumPost: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("forumPost.ejs", { forumPost: forumPost, user: req.user, comments: comments  });
      console.log(comments)
    } catch (err) {
      console.log(err);
    }
  },
  createForumPost: async (req, res) => {
    console.log(req.body)
    try {
      
      await Forum.create({
        title: req.body.title,
        message: req.body.message,
        userName: req.user.userName,
        user: req.user.id,
      });
      console.log(req.file)
      console.log("Forum post has been added!");
      res.redirect("/forumFeed");
    } catch (err) {
      console.log(err);
    }
  },
 
 
  deleteForumPost: async (req, res) => {
    try {
      // Find post by id
      //let forumPost = await Forum.findById({ _id: req.params.id });
      // Delete image from cloudinary
     // await cloudinary.uploader.destroy(forumPost.cloudinaryId);
      // Delete post from db
      await Forum.remove({ _id: req.params.id });
      console.log("Deleted Forum Post");
      res.redirect("/forumFeed");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
