const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        // In a production environment, you should use proper password hashing
        if (password !== user.password) {
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
