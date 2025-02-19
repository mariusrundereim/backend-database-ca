// app.js
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");
const initializeDatabase = require("./utils/initDb");
const fs = require("fs");

// Import routes
var indexRouter = require("./routes/index");
var animalsRouter = require("./routes/animals");
var speciesRouter = require("./routes/species");
var temperamentRouter = require("./routes/temperament");
const { router: authRouter } = require("./routes/auth");

var app = express();

// Create sessions directory if it doesn't exist
const sessionsDir = path.join(__dirname, "sessions");
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true, mode: 0o755 });
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware setup (order is important)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Single session configuration
const sessionStore = new MySQLStore({
  host: process.env.HOST,
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE_NAME,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and load config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Make user object available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes - simplify auth routes
app.use("/", indexRouter);
app.use("/animals", animalsRouter);
app.use("/species", speciesRouter);
app.use("/temperament", temperamentRouter);
app.use("/", authRouter); // This will handle auth routes including /login

// Initialize database
initializeDatabase().catch(console.error);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
