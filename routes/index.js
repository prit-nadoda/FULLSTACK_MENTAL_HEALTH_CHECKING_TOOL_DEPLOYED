var express = require('express');
var router = express.Router();
const seedDataFromJSON = require('./dataSeeding');
seedDataFromJSON();

var userModel = require("./users");
var optionModel = require("./options");
var questionModel = require("./questions");
var reportModel = require("./reports");
var conditionModel = require("./conditions");
var expertModel = require("./experts");
var adminModel = require("./admin")
var contactModel = require("./contact")

var passport = require("passport");
var localStrategy = require("passport-local");

var url = require("url");
var upload = require("./multer");
const users = require('./users');


passport.use(new localStrategy(userModel.authenticate()))



//navigating routes start
router.get('/', async function (req, res, next) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }

  var exData = await expertModel.find().limit(3);

  res.render('index', { navLogin, exData });
});

router.get('/register', (req, res) => {
  // Retrieve flash messages
  const errorMessage = req.flash('error');
  const successMessage = req.flash('success');

  var refUrl = req.get('Referer');
  var preUrl = url.parse(refUrl).pathname;

  res.render('register', { errorMessage, successMessage, preUrl });
});


router.get('/login', function (req, res, next) {
  var refUrl = req.get('Referer');
  var preUrl = url.parse(refUrl).pathname;
  res.render('login', { error: req.flash("error"), preUrl });
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  var navLogin = false;
  var isDeleted = req.session.isDeleted;
  delete req.session.isDeleted;

  var isEdited = req.session.isEdited
  delete req.session.isEdited

  var isAuthSuccess = req.session.isAuthSuccess
  delete req.session.isAuthSuccess

  if (req.isAuthenticated()) {
    navLogin = true
  }
  var user = await userModel.findOne({ username: req.session.passport.user })
    .populate({
      path: 'reports',
      options: { sort: { date: -1 }, limit: 3 } 
    });
  res.render('profile', { navLogin, user, isDeleted, isAuthSuccess, isEdited });
});

router.get('/editprofile', isLoggedIn, async function (req, res, next) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }
  var refUrl = req.get('Referer');
  var preUrl = url.parse(refUrl).pathname;

  var user = await userModel.findOne({ username: req.session.passport.user });

  res.render('editprofile', { navLogin, preUrl, user });
});

router.get('/about', function (req, res, next) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }
  res.render('about', { navLogin });
});

router.get('/tools', function (req, res, next) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }
  res.render('tools', { navLogin });
});

router.get('/report', isLoggedIn, async function (req, res, next) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }
  const latestReport = await userModel
    .findOne({ username: req.session.passport.user })
    .populate({
      path: 'reports',
      options: { sort: { date: -1 }, limit: 1 } 
    });
  const reportData = latestReport.reports[0]
  res.render('report', { navLogin, reportData });
});

//opening a report by user click
router.get('/report/:id', isLoggedIn, async function (req, res) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }
  const reportId = req.params.id;
  const user = await userModel.findOne({ username: req.session.passport.user })
    .populate("reports")
    .then(function (user) {
      const reportData = user.reports.find(report => report._id.toString() === reportId);
      res.render('report', { navLogin, reportData });
    })

});


//deleting report
router.get('/deletereport/allreports/:id', isLoggedIn, async function (req, res) {
  const reportId = req.params.id;
  const user = await userModel.findOne({ username: req.session.passport.user });
  const currentPage = req.originalUrl

  req.session.isDeleted = true;
  if (user.reports.includes(reportId)) {
    user.reports.pull(reportId);
    await user.save();
    await reportModel.findOneAndDelete({ _id: reportId });;
    res.redirect("/allreports");
  }
});

router.get('/deletereport/profile/:id', isLoggedIn, async function (req, res) {
  const reportId = req.params.id;
  const user = await userModel.findOne({ username: req.session.passport.user });
  const currentPage = req.originalUrl

  req.session.isDeleted = true;
  if (user.reports.includes(reportId)) {
    user.reports.pull(reportId);
    await user.save();
    await reportModel.findOneAndDelete({ _id: reportId });;
    res.redirect("/profile");
  }
});

router.get('/allreports', isLoggedIn, async function (req, res, next) {
  var navLogin = false;
  var isDeleted = req.session.isDeleted
  delete req.session.isDeleted;

  if (req.isAuthenticated()) {
    navLogin = true
  }
  var user = await userModel.findOne({ username: req.session.passport.user })
    .populate({
      path: 'reports',
      options: { sort: { date: -1 } } // Sort in descending order based on date and time, limit to 1 result
    });
  
  res.render('allreports', { navLogin, user, isDeleted });
});

router.post("/editprofile", upload.single("image"), async function (req, res) {
  var updatedUser = await userModel.findOneAndUpdate({ username: req.session.passport.user }, {
    username: req.body.username,
    fullname: req.body.fullname,
  }, { new: true })

  if (req.file) {
    updatedUser.profileimage = req.file.filename;
    await updatedUser.save();
  }

  req.session.isEdited = true
  res.redirect("/profile")
})

router.get('/exprofile/:name', isLoggedIn, async function (req, res, next) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }

  var exName = req.params.name;
  var expertData = await expertModel.findOne({ name: exName });

  res.render('exprofile', { navLogin, expertData });
});

router.get("/allexperts", async function (req, res) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }
  var exData = await expertModel.find()

  res.render('allexperts', { navLogin, exData });
})



router.get("/tips/:condition", isLoggedIn, async function (req, res) {
  var navLogin = false;
  if (req.isAuthenticated()) {
    navLogin = true
  }
  var condition = req.params.condition;
  var conData = await conditionModel.findOne({ condition: condition });
  var exData = await expertModel.find({ conditions: { $in: condition } });

  res.render('tips', { navLogin, conData, exData });
})

router.post("/contact", isLoggedIn,async function(req,res){
  const contactData = await contactModel.create({
    fullname: req.body.fullname,
    username: req.body.username,
    mail: req.body.email,
    type: req.body.type,
    messege: req.body.messege
  })
  
  var user = await userModel.findOne({username: req.session.passport.user})
  user.contacts.push(contactData._id)
  await user.save()
  res.redirect(req.currentPage);
})



//auth starts
//- normal user register
router.post('/register', function (req, res) {
  userData = new userModel({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email
  });

  userModel.register(userData, req.body.password).then(
    function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        
        req.flash('success', 'Registration successful!');
        req.session.isAuthSuccess = true
        res.redirect("/profile");
      });
    },
    function (err) {
      
      
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        // Duplicate email error
        req.flash('error', 'A user with this email is already registered.');
      } else {
        req.flash('error', err.message);
      }
      res.redirect("/register");
    }
  );
});


//--normal user login

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
  //failureFlash: true
}), function (req, res) {

})

//-- logout

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) return next(err);
    res.redirect("/")
  })
})
//-- isLoggedIn middleware (route protector)

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//-- Admin login

// Admin login
router.post('/admin/login', function (req, res, next) {
  // Use passport.authenticate middleware with custom callback
  passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
          // Authentication failed, redirect to login page with error message
          req.flash('error', info.message);
          return res.redirect('/admin');
      }
      if (user.usertype !== 'admin') {
          // User is not an admin, redirect to login page with error message
          req.flash('error', 'You are not authorized to access the admin dashboard.');
          return res.redirect('/admin');
      }
      // Authentication successful, log in the user
      req.logIn(user, function (err) {
          if (err) { return next(err); }
          // Redirect to admin dashboard upon successful login
          return res.redirect('/admin/dashboard');
      });
  })(req, res, next);
});

router.get('/admin', function (req, res, next) {
  res.render('admin-login', { error: req.flash("error")});
});

function isAdminLoggedIn(req, res, next) {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
      // User is not authenticated, redirect to login page
      return res.redirect('/admin');
  }
  
  // Check if user is an admin
  if (req.user && req.user.usertype === 'admin') {
      // User is an admin, proceed to the next middleware or route handler
      return next();
  } else {
      // User is not an admin, redirect to unauthorized page or handle accordingly
      return res.redirect('/admin');
  }
}


router.get("/admin/dashboard", isAdminLoggedIn,function(req,res){
  res.send("done")
})

//auth ends

//test and report generation starts
router.get('/test', isLoggedIn, async function (req, res) {

  const questions = await questionModel.find();
  res.render("test", { questions })

});

router.post('/test', async function (req, res) {
  try {
    const userResponses = req.body; //form mathi answeres lidha
    const selectedOptions = Object.values(userResponses); //teni unwanted keys remove kri
    
    const optionData = await optionModel.find(); //optionModel na * data lidha
    var conditionArray = []
    for (const option of selectedOptions) {  //ee * data sathe selectedOptions na badha data compare kari 
      const opt = optionData.find((doc) => doc.text === option);

      if (opt) {
        // matched data ni conditions key ni value ne conditionArray ma push kari
        conditionArray.push(opt.condition)
      }
    }
    conditionArray = conditionArray.flat()

    const occurrenceCount = {};

    //occurance check kryu
    conditionArray.forEach(element => {
      occurrenceCount[element] = (occurrenceCount[element] || 0) + 1;
    });

    const userConditions = [];
    // user ni condition determine kri based on occurance and ene userCondition ma push kravi didhi
    for (const element in occurrenceCount) {
      if (occurrenceCount[element] >= 3) {
        userConditions.push(element);
      }
    }

    const conditionsData = [];

    // optionModel na elements traverse krya each ones as condition
    for (const condition of userConditions) {
      // userCondition thi match thay ee data
      const optionsForCondition = await optionModel.find({ condition: condition });
      var iconForCondition = await conditionModel.findOne({ condition: condition }); //condition mate icon select kryu

      // signs mate text key ni value lidhi signsForCondition array ma
      const signsForCondition = optionsForCondition
        .filter(option => selectedOptions.includes(option.text))
        .map(option => option.text);

      // conditionObject banavyo jema condition and eni sign pass kari didhi
      const conditionObject = {
        condition: condition,
        signs: signsForCondition,
        icon: iconForCondition.icon[0]
      };

      // tene conditionData(array of objects) ma push karavi didhi 
      conditionsData.push(conditionObject);
    }

    // ResultModel mate suitable data generate thay gaya

    let report
    //reportModel ma inserttion using instance
    var user = await userModel.findOne({ username: req.session.passport.user });
    if (conditionsData.length > 0) {
      report = new reportModel({
        user: user._id,
        conditions: conditionsData
      });
    } else {
      report = new reportModel({
        user: user._id, //incase koi significant signs nathi
        conditions: { condition: "You have Balanced Mental State", signs: ["No significant signs"] }
      });
    }

    var reportData = await reportModel.create(report);
    reportData = await report.save() //report created

    var user = await userModel.findOne({ username: req.session.passport.user });
    user.reports.push(reportData._id) //as per reference, report ni ID user ma push kari
    await user.save()



  } catch (error) {
    console.error('Error processing test:', error);
    res.status(500).send('Internal Server Error');
  }
});
//test and report generation ends

module.exports = router;
