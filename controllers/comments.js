const Comment = require("../models/Comment");
const nodemailer = require("nodemailer");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        forumPost: req.params.id,
        user: req.user.id,
        userName: req.user.userName,
      });
      console.log(req);
      console.log("Comment has been added!");
      res.redirect("/forum/" + req.params.id);
      // send email to admin when comment to forum post has been made
      const output = `
      <p> You have a new comment on the forum post with ID: ${req.params.id}</p>
      <p> with the comment: ${req.body.comment}</p>
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
        subject: "New forum comment on Barmate",
        text: "A new comment has been added",
        html: output,
      });
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Find comment by id
      let comment = await Comment.findById({ _id: req.params.id });
      console.log(req);
      // Delete comment from db
      await comment.remove({ _id: req.params.id });
      console.log("Deleted Comment");
      res.redirect("/forum/" + req.params.postId);
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
