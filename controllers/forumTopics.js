const cloudinary = require("../middleware/cloudinary");
const Forum = require("../models/Forum");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const nodemailer = require("nodemailer");

module.exports = {
  getForumFeed: async (req, res) => {
    try {
      const forumPosts = await Forum.find().sort({ createdAt: "desc" }).lean();
      res.render("forum.ejs", { ForumPosts: forumPosts });
      return forumPosts;
    } catch (err) {
      console.log(`Yikes, you ran into an error: ${err}`);
    }
  },

  getForumPost: async (req, res) => {
    try {
      const forumPost = await Forum.findById(req.params.id);
      const comments = await Comment.find({ forumPost: req.params.id })
        .sort({ createdAt: "desc" })
        .lean();
      res.render("forumPost.ejs", {
        forumPost: forumPost,
        user: req.user,
        comments: comments,
      });
      console.log(comments);
    } catch (err) {
      console.log(err);
    }
  },
  createForumPost: async (req, res) => {
    console.log(req.body);
    try {
      await Forum.create({
        title: req.body.title,
        message: req.body.message,
        userName: req.user.userName,
        user: req.user.id,
      });
      res.redirect("/forumFeed");
      //sending an email to admin to notify when forum post is made
      const output = `
        <p> You have a new forum most titled: ${req.body.title}</p>
        <p> with the message: ${req.body.message}</p>
        <p> from: ${req.user.userName}</p>
      `;
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.GMAIL_SECRET,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: "barMate <steinbeals@gmail.com>",
        to: "adamspersonaldeveloping@gmail.com",
        subject: "New forum post on Barmate",
        text: "Hello World",
        html: output,
      });
      console.log("Forum post has been added!");
    } catch (err) {
      console.log(err);
    }
  },

  deleteForumPost: async (req, res) => {
    try {
      await Forum.remove({ _id: req.params.id });
      console.log("Deleted Forum Post");
      res.redirect("/forumFeed");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
