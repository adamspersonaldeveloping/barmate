
const Comment = require("../models/Comment");

module.exports = {
 
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        forumPost: req.params.id,
        user: req.user.id,
        userName: req.user.userName,
      });
      console.log(req.user)
      console.log(req.user.userID)
      console.log("Comment has been added!");
      res.redirect("/forum/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Find post by id
      let comment = await Comment.findById({ _id: req.params.id });
    console.log(req)
      // Delete post from db
      await comment.remove({ _id: req.params.id });
      console.log("Deleted Comment");
      res.redirect("/forum/"+req.params.postId);
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
