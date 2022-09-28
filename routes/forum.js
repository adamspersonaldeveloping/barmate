const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const forumController = require("../controllers/forumTopics");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, forumController.getForumPost);

router.post("/createForumPost", upload.single("file"), forumController.createForumPost);

router.delete("/deleteForumPost/:id", forumController.deleteForumPost);

module.exports = router;
