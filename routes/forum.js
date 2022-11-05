const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const forumController = require("../controllers/forumTopics");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", forumController.getForumPost);

router.post("/createForumPost", ensureAuth, upload.single("file"), forumController.createForumPost);

router.delete("/deleteForumPost/:id", ensureAuth,forumController.deleteForumPost);

module.exports = router;
