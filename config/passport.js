const LocalStrategy = require("passport-local").Strategy;
const AuthService = require("../services/authService");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        console.log("Passport authentication attempt:", { username });

        const user = await AuthService.verifyUser(username, password);

        if (!user) {
          console.log("Authentication failed for user:", username);
          return done(null, false, { message: "Invalid credentials" });
        }

        console.log("Authentication successful for user:", username);
        return done(null, user);
      } catch (err) {
        console.error("Passport authentication error:", err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.username);
    done(null, { id: user.id, username: user.username, role: user.role });
  });

  passport.deserializeUser((user, done) => {
    console.log("Deserializing user:", user.username);
    done(null, user);
  });
};
