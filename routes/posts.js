const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", upload.single("file"), postsController.createPost);

router.put("/favoritePost/:id", postsController.favoritePost);

router.put("/deleteFavorite/:id", postsController.deleteFavorite);

router.put("/makePrivate/:id", postsController.makePrivate);

router.put("/makePublic/:id", postsController.makePublic);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
