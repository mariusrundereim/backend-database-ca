const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");
const User = db.User;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        if (password !== user.password) {
          // In production, use proper password hashing
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
