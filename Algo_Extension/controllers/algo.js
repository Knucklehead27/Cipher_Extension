const Algo = require("../models/algorithm");

module.exports = {
  postAlgorithm: async (req, res) => {
    try {
      // console.log(req.body);
      // console.log(req.user);
      const info = {
        name: req.body.name,
        description: req.body.description,
        code: req.body.code,
        contributedBy: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
        },
        practiceLink: req.body.practiceLink,
        createdOn: new Date().getTime(),
      };
      Algo.create(info, (error, algorithm) => {
        if(error) {
          // console.log(error);
          return res.json({
            success: false,
            message: "Something went wrong! Please try again.",
          });
        }
        // console.log("algorithm", algorithm);
        const newContribution = {
          "id": algorithm._id,
          "name": algorithm.name
        };
        req.user.contributed.push(newContribution);
        req.user.save();
        res.redirect("/");
        // res.json({
        //   success: true,
        //   message: "Algorithm posted",
        //   algoId: algorithm.id,
        // });
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  },

  findAlgorithm: async (req, res) => {
    try {
      Algo.findById(req.params.id, async (error, algorithm) => {
        if (error) {
          res.json({
            success: false,
            message: "Something went wrong! Please try again.",
          });
        }
        var downvoted = algorithm.downCount;
        var upvoted = algorithm.upCount;
        var up = false;
        var down = false;
        if(req.user){
          await downvoted.forEach((element) => {
            if (element._id == req.user.id) {
              // console.log("found in downvote");
              down = true;
            }
          });
          await upvoted.forEach((element) => {
            if (element._id == req.user.id) {
              // console.log("found in downvote");
              up = true;
            }
          });
          let markedArray = req.user.bookmarked;
          var marked = false;
          await markedArray.forEach((element) => {
            if (element.id == req.params.id) {
              flag = true;
            }
          });
        }

        res.render("algodetail.ejs", {algo: algorithm, up: up, down: down, marked : marked});
        // res.json({
        //   success : true,
        //   message : "Algorithm found and returned.",
        //   algorithm : algorithm
        // })
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  },

  upvote: async (req, res) => {
    try {
      Algo.findById(req.params.id, async (error, algorithm) => {
        if (error) {
          res.json({
            success: false,
            message: "Something went wrong! Please try again.",
          });
        }
        var downvoted = algorithm.downCount;
        var upvoted = algorithm.upCount;
        var i = 0;
        await downvoted.forEach((element) => {
          if (element._id == req.user.id) {
            downvoted.splice(i, i + 1);
            // break;
          }
          i++;
        });
        var flag = true;
        await upvoted.forEach((element) => {
          if (element._id == req.user.id) {
            flag = false;
          }
        });
        if (flag) {
          upvoted.push(req.user.id);
        }
        algorithm.downCount = downvoted;
        algorithm.upCount = upvoted;
        algorithm.save();
        res.json({
          success: true,
          message: "upvote done",
          upvoteCount: upvoted.length,
          downvoteCount: downvoted.length,
        });
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  },

  downvote: async (req, res) => {
    try {
      Algo.findById(req.params.id, async (error, algorithm) => {
        if (error) {
          res.json({
            success: false,
            message: "Something went wrong! Please try again.",
          });
        }
        var downvoted = algorithm.downCount;
        var upvoted = algorithm.upCount;
        var i = 0;
        await upvoted.forEach((element) => {
          if (element._id == req.user.id) {
            // console.log("found in upvote");
            upvoted.splice(i, i + 1);
            // break;
          }
          i++;
        });
        var flag = true;
        await downvoted.forEach((element) => {
          if (element._id == req.user.id) {
            // console.log("found in downvote");
            flag = false;
          }
        });
        if (flag === true) {
          downvoted.push(req.user.id);
        }
        console.log(downvoted);
        console.log(upvoted);
        algorithm.downCount = downvoted;
        algorithm.upCount = upvoted;
        algorithm.save();
        res.json({
          success: true,
          message: "downvote done",
          upvoteCount: upvoted.length,
          downvoteCount: downvoted.length,
        });
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  },

  bookmark: async (req, res) => {
    try {
      let markedArray = req.user.bookmarked;
      var flag = true;
      let i = 0;
      await markedArray.forEach((element) => {
        if (element._id == req.params.id) {
          markedArray.splice(i, i+1);
          flag = false;
        }
        i++;
      });
      if (flag === true) {
        const algo = Algo.findById(req.params.id);
        const obj = {
          "id" : req.params.id,
          "name" : algo.name
        }
        markedArray.push(obj);
      }
      req.user.bookmarked = markedArray;
      req.user.save();

      res.json({
        success: true,
        message: "bookmark done",
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  },
};
