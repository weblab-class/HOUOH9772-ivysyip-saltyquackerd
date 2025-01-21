/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/
const Group = require("./models/group");

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});
// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.get("/user", (req, res) => {
  User.findById(req.query.userid)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send("User Not");
    });
});

const bodyParser = require("body-parser");

let userBio = "This is the default bio."; // Store bio in memory (use database in production)

router.use(bodyParser.urlencoded({ extended: true }));

// Route for the Edit Profile Page (Form submission)
router.post("/update-bio", (req, res) => {
  userBio = req.body.bio; // Save new bio
  res.redirect("/profile"); // Redirect to profile page
});

// Route for the Profile Page
router.get("/profile", (req, res) => {
  res.send(`<h1>Your Profile</h1><p>${userBio}</p><a href="/edit-profile">Edit Bio</a>`);
});

// Route for the Edit Profile Page
router.get("/accounts/edit/:user", (req, res) => {
  res.send(`
    <h1>Edit Your Bio</h1>
    <form action="/update-bio" method="POST">
      <textarea name="bio">${userBio}</textarea>
      <button type="submit">Save</button>
    </form>
  `);
});

router.get("/user", (req, res) => {
  User.find(req.query.userId).then((user) => {
    res.send(user);
  });
});

router.post("/newgroup", (req, res) => {
  const newGroup = new Group({
    join_code: req.body.join_code,
    group_name: req.body.group_name,
    users: req.body.users,
  });

  newGroup.save().then((group) => res.send(group));
});

router.get("/group", (req, res) => {
  Group.find({ users: { $in: [req.query.userid] } }).then((groups) => {
    res.send(groups);
  });
});

router.post("/join", (req, res) => {
  Group.findOneAndUpdate(
    { join_code: req.body.join_code }, // Find the group by join_code
    { $push: { users: req.body.userId } }, // Add userId to users array (avoids duplicates)
    { new: true } // Return the updated group
  ).then((group) => {
    res.send(group);
  });
});

const generateRandomGroupCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

router.get("/code", async (req, res) => {
  try {
    let isUnique = false;
    let groupCode;
    while (!isUnique) {
      groupCode = generateRandomGroupCode();
      const existingCode = await Group.findOne({ join_code: groupCode });
      if (!existingCode) {
        isUnique = true;
      }
    }
    res.json({ groupCode });
  } catch (error) {
    console.error("Error generating group code:", error);
    res.status(500).json({ error: "Failed to generate group code" });
  }
});


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
