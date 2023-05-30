const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const forumController = require("../controllers/forumTopics")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/favorites", ensureAuth, postsController.getFavorites);

router.get("/feed", postsController.getFeed);
router.get("/feedZtoA", postsController.getFeedZtoA);
router.get("/feedIBA", postsController.getFeedIBA);
router.get("/feedNoIBA", postsController.getFeedNoIBA);
router.get("/getFeedUnforgettables", postsController.getFeedUnforgettables);
router.get("/getFeedNewEraDrinks", postsController.getFeedNewEraDrinks);


router.get("/forumFeed", forumController.getForumFeed);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
