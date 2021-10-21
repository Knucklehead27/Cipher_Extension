require("dotenv").config();
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');

signToken = user => {
  return JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: new Date().setDate(new Date().getDate() + 1) // expires in 24 hours
  });
}

module.exports = {
  signUp: async (req, res, next) => {
    const {name, email, password } = req.body;
    const foundUser = await User.findOne({ "email": email });
    if (foundUser) { 
      return res.status(403).json({ 
          success : false,
          message: 'Email is already in use'
        });
    }

    var hash = await User.hashedPassword(password);
    const newUser = new User({ 
      method: 'local',
      name: name,
      role: "student",
      email: email, 
      createdAt: new Date().getTime(),
      local: {
        password: hash
      }
    });
    await newUser.save();
    res.redirect("/login");
    // console.log(req.session);
    // res.json({
    //     success : true,
    //     method : "local",
    //     message : "You have successfully signed up"
    // })
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.cookie("jwt_access_token", token, {
    });
    // console.log(req.session);
    res.redirect("/");
    // res.json({
    //     success : true,
    //     method : "local",
    //     token : token,
    //     message : "You have successfully logged in"
    // })
  },

  googleOAuth: async (req, res, next) => {
    const token = signToken(req.user);
    res.cookie("jwt_access_token", token, {
    });
    res.redirect("/dashboard/home");
  }  
}