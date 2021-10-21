require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Algo = require("./models/algorithm");
const Auth = require("./routes/auth");
const Algorithm = require("./routes/algo");
const { MongoClient } = require("mongodb");
const isNotLoggedIn = require("./middlewares/isNotLoggedIn");
const isLoggedIn = require("./middlewares/isLoggedIn.js");
const verifyToken = require("./middlewares/verifyToken.js");
const app = express();
require("./passport");

mongoose
  .connect(process.env.mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("ERROR:", err.message);
  });

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: "nishu",
    saveUninitialized: false,
    resave: false,
  })
);
const cors = require('cors');
const corsOptions ={
    origin:"http://127.0.0.1:5500", 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("assets"));

app.use(function (req, res, next) {
  res.locals.nowUser = req.user;
  res.locals.isAuth = req.user ? true : false;
  next();
});

app.get("/", async (req, res) => {
  let fil;
  if (req.query.filter) {
    fil = req.query.filter;
  }
  Algo.find({}, async (error, algo) => {
    if (error) {
      res.json({
        success: false,
        message: "Something went Wrong!",
      });
    }
    let algoArray = [];
    var dropArr = [];
    await algo.forEach((element) => {
      dropArr.push(element.name);
      if (req.query.filter) {
        if (element.name.toLowerCase().includes(fil.toLowerCase())) {
          algoArray.push(element);
        }
      } else {
        algoArray.push(element);
      }
    });
    // console.log(dropArr);
    // console.log(algo);
    res.render("algohome.ejs", { algo: algoArray, dropArr: dropArr });
  });
});

app.get("/algoList", async (req, res) => {
  Algo.find({}, async (error, algo) => {
    if (error) {
      res.json({
        success: false,
        message: "Something went Wrong!",
      });
    }
    var dropArr = [];
    await algo.forEach((element) => {
      dropArr.push(element.name);
    });
    // res.send('Access-Control-Allow-Origin', '*');
    res.json({
      success: true,
      list: dropArr,
    });
  });
});

app.get("/algo", async (req, res) => {
  let fil = req.query.filter;
    console.log(fil);
  Algo.find({}, async (error, algo) => {
    if (error) {
      res.json({
        success: false,
        message: "Something went Wrong!",
      });
    }
    let algoArray = [];
    await algo.forEach((element) => {
        if (element.name.toLowerCase().includes(fil.toLowerCase())) {
          algoArray.push(element.code);
        }
    });
    res.json({
      success: true,
      algoArray: algoArray,
    });
  });
});

app.get("/login", isNotLoggedIn, async (req, res) => {
  res.render("loginsignup.ejs");
});

app.get("/profile", isLoggedIn, verifyToken, async (req, res) => {
  const profileUser = req.user;
  let contri = profileUser.contributed;
  let marked = profileUser.bookmarked;
  res.render("profile.ejs", {
    profileUser: profileUser,
    contri: contri,
    marked: marked,
  });
});
app.get("/contribute", isLoggedIn, verifyToken, async (req, res) => {
  res.render("contribute.ejs");
});

app.use("/user", Auth);
app.use("/algorithm", Algorithm);

app.listen(process.env.PORT || "5000", () => {
  console.log("Backend Started ....");
});
