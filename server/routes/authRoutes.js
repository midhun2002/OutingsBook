// const express = require('express');
// const router = express.Router();
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

// router.use(passport.initialize());
// router.use(passport.session());

const User = require('../models/userAuth');
require('dotenv').config({path:__dirname + '../../.env'});

// const userInfoSchema = new mongoose.Schema({
//   userId:String,
//   imageURL:String,
//   websiteURL:{
//     type:String,
//     required:true
//   },
//   websiteName:{
//     type:String,
//     required:true
//   }
// });
// const UserInfo = new mongoose.model("UserInfo", userInfoSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);

      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// router.get("/", function (req, res) {
//   res.render("home");
// });

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );

// router.get(
//   "/auth/google/secrets",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect to secrets.
//     res.redirect("/secrets");
//   }
// );

// router.get("/login", function (req, res) {
//   res.render("login");
// });

// router.get("/register", function (req, res) {
//   res.render("register");
// });

// router.get("/logout", function (req, res) {
//     req.logout();
//     res.redirect("/");
//   });

// router.post("/register", function (req, res) {
//     User.register(
//       { username: req.body.username },
//       req.body.password,
//       function (err, user) {
//         if (err) {
//           console.log(err);
//           res.redirect("/register");
//         } else {
//           passport.authenticate("local")(req, res, function () {
//             res.redirect("/secrets");
//           });
//         }
//       }
//     );
//   });

// router.post("/login", function (req, res) {
//     const user = new User({
//       username: req.body.username,
//       password: req.body.password,
//     });
//     // console.log(user);
  
//     req.login(user, function (err) {
//       if (err) {
//         console.log(err);
//       } else {
//         passport.authenticate("local")(req, res, function () {
//           res.redirect("/secrets");
//         });
//       }
//     });
//   });