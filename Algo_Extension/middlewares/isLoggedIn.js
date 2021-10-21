const passport = require('passport');

function isLoggedIn(req, res, next) {
    if (!req.user) {
      // req.session = null;
      res.redirect("/login");
      // res.json({
      //     success : false,
      //     message : "Please LogIn first."
      // });
    } else {
      next();
    }
  } 

  module.exports = isLoggedIn;