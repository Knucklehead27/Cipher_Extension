const express = require('express');
const router = require('express-promise-router')();
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const verifyToken = require("../middlewares/verifyToken.js");
const User = require("../models/user");
const Algo = require("../models/algorithm");
const algoController = require("../controllers/algo");

router.post('/contribute', isLoggedIn, verifyToken, algoController.postAlgorithm);
router.get('/:id', algoController.findAlgorithm);
router.get('/upvote/:id', isLoggedIn, verifyToken, algoController.upvote);
router.get('/downvote/:id', isLoggedIn, verifyToken, algoController.downvote);
router.get('/bookmark/:id', isLoggedIn, verifyToken, algoController.bookmark);


module.exports = router;