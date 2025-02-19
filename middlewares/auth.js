const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).send("Access denied: Admin rights required");
};

const isMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "member") {
    return next();
  }
  res.status(403).send("Access denied: Member rights required");
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isMember,
};
