const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
module.exports = function (passport) {
  //refractoring passport.use to use async await instead of callbacks because mongoose no longer supports callbacks in .findOne()
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
          }
          if (!user.password) {
            return done(null, false, {
              msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
            });
          }
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            return done(null, user); //no errors, return user object
          } else {
            return done(null, false, { msg: "Invalid email or password." }); //no system error, authentication failed, error message
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // passport.use(
  //   new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
  //     //need to refractor
  //     User.findOne({ email: email.toLowerCase() }, (err, user) => {
  //       if (err) {
  //         return done(err);
  //       }
  //       if (!user) {
  //         return done(null, false, { msg: `Email ${email} not found.` });
  //       }
  //       if (!user.password) {
  //         return done(null, false, {
  //           msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
  //         });
  //       }
  //       user.comparePassword(password, (err, isMatch) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         if (isMatch) {
  //           return done(null, user);
  //         }
  //         return done(null, false, { msg: "Invalid email or password." });
  //       });
  //     });
  //   })
  // );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  //mongoose no longer supports callback functions in .findById()
  // passport.deserializeUser((id, done) => {
  //   User.findById(id, (err, user) => done(err, user));
  // });
};
