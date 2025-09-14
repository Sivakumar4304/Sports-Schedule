if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const User = require("./models/user");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const sportsRoutes = require("./routes/sportsRoutes");
// const ExpressError = require("./utils/ExpressError");

const app = express();

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// MongoDB Connection
const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Session Config
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SECRET || "supersecretpassword",
  touchAfter: 24 * 60 * 60,
});

const sessionOptions = {
  store,
  name: "sportsSession",
  secret: process.env.SECRET || "supersecretpassword",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);
app.use("/sports", sportsRoutes);

// Routes placeholder
app.get("/", (req, res) => {
  res.send("Sports Scheduler Backend 🚀");
});

// Error handling
// app.all("*", (req, res, next) => {
//   next(new ExpressError("Page Not Found", 404));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(err.message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
