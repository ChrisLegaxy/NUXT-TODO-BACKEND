const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User");

const User = UserModel;

module.exports = passport => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      await User.findOne({ username }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, {
            status: 401,
            success: false,
            message: "Username doesn't exist"
          });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              status: 401,
              success: false,
              message: "Password is incorrect"
            });
          }
        });
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
