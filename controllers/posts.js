const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    try {
      //const favs = await req.user.favorites.find({ user: req.user.id})
      const posts = await Post.find({ _id: { $in : req.user.favorites}});
      res.render("favorites.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ cocktailName: 1 }).lean();//.sort({ cocktailName: 1 })
      const posts = allPosts.filter((e)=> e.public !== false)
      res.render("feed.ejs", { posts: posts, user: req.user });
      console.log(posts.filter(e=>e.ibaCocktail == false).length)
    } catch (err) {
      console.log(err);
    }
  },
  getFeedIBA: async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ cocktailName: 1 }).lean();
      const posts = allPosts.filter((e)=> e.ibaCocktail !== false)
      res.render("feed.ejs", { posts: posts, user: req.user });
      
    } catch (err) {
      console.log(err);
    }
  },
  getFeedNoIBA: async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ cocktailName: 1 }).lean();
      const posts = allPosts.filter((e)=> e.ibaCocktail === false)
      res.render("feed.ejs", { posts: posts, user: req.user });
      
    } catch (err) {
      console.log(err);
    }
  },
  getFeedZtoA: async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ cocktailName: -1 }).lean();
      const posts = allPosts.filter((e)=> e.public !== false)
      res.render("feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeedUnforgettables: async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ cocktailName: 1 }).lean();
      const posts = allPosts.filter((e)=> e.importance === "The Unforgettables")
      res.render("feed.ejs", { posts: posts, user: req.user });
      
    } catch (err) {
      console.log(err);
    }
  },
  getFeedNewEraDrinks: async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ cocktailName: 1 }).lean();
      const posts = allPosts.filter((e)=> e.importance === "New Era Drinks")
      res.render("feed.ejs", { posts: posts, user: req.user });
      
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
      //console.log(post)
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    console.log(req.file)
    try {
      let result;
      if(req.file) result = await cloudinary.uploader.upload(req.file.path);
      else result = {secure_url: 'https://res.cloudinary.com/dllmha3wx/image/upload/v1667614935/logo-barmate-not-found_inxzqr.png', public_id: 'logo-barmate-not-found_inxzqr'}
    
      await Post.create({
        cocktailName: req.body.cocktailName.charAt(0).toUpperCase() + req.body.cocktailName.slice(1).toLowerCase(),
        ingredients: [
          req.body.ingredient1,
          req.body.ingredient2,
          req.body.ingredient3,
          req.body.ingredient4,
          req.body.ingredient5,
          req.body.ingredient6,
          req.body.ingredient7,
          req.body.ingredient8,
          req.body.ingredient9,
           req.body.ingredient10,
        ],
        method: req.body.method,
        garnish: req.body.garnish || "N/A",
        note: req.body.note || "N/A",
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ibaCocktail: false,        
        public: req.body.public || 'true',
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  favoritePost: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {favorites: req.params.id },
        }
      );
      
      console.log("Added to favorites");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteFavorite: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $pull: {favorites: req.params.id },
        }
      );
      
      console.log("Removed from favs");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  makePrivate: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {public: false },
        }
      );
      console.log("made post private");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  makePublic: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {public: true },
        }
      );
      console.log("made post public");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
