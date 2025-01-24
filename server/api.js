/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

// import models so we can interact with the database
const User = require("./models/user");
const Group = require("./models/group");
const Picture = require("./models/picture");
const Challenge = require("./models/challenge");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_BUCKET_NAME;

// File Upload Setup with Multer
const upload = multer({
  storage: multer.memoryStorage(),
});

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

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.get("/user", (req, res) => {
  User.findById(req.query.userid)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send("User Not Found");
    });
});

router.get("/picturesbyuser", (req, res) => {
  Picture.find({ creator_id: req.query.userid }).then((pictures) => {
    res.send(pictures);
  });
});

router.get("/picturesByUserAndDate", (req, res) => {
  Picture.find({ creator_id: req.query.userid, date: req.query.date }).then((pictures) => {
    res.send(pictures);
  });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { user_id, challenge } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }
    const fileContent = req.file.buffer;
    const fileName = `uploads/${user_id}/${Date.now()}_${req.file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();

    const date_full = new Date().toISOString();
    const day = date_full.split("T")[0];

    const existingPicture = await Picture.findOne({ creator_id: user_id, date: day });

    if (existingPicture) {
      existingPicture.link = uploadResult.Location;

      await existingPicture.save();

      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl: uploadResult.Location,
        pictureId: existingPicture._id,
      });
    } else {
      const newPicture = new Picture({
        creator_id: user_id,
        date: day,
        link: uploadResult.Location,
        challenge: challenge || "default",
      });

      await newPicture.save();

      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl: uploadResult.Location,
        pictureId: newPicture._id,
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

router.get("/challenge", async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ date: req.query.date });

    if (challenge) {
      res.send(challenge);
    } else {
      res.status(404).json({ error: "No challenge found for today." });
    }
  } catch (err) {
    console.error("Error in /challenge route:", err);
    res.status(500).json({ error: "Error fetching daily challenge." });
  }
});

router.use(bodyParser.urlencoded({ extended: true }));

router.post("/bio", (req, res) => {
  User.findOneAndUpdate({ _id: req.body.userId }, { bio: req.body.bio }, { new: true }).then(
    (bio) => {
      res.send(bio);
    }
  );
});

// creating new group
router.post("/newgroup", (req, res) => {
  const newGroup = new Group({
    join_code: req.body.join_code,
    group_name: req.body.group_name,
    users: req.body.users,
  });

  newGroup.save().then((group) => res.send(group));
});

// geting groups based on userid
router.get("/group", (req, res) => {
  Group.find({ users: { $in: [req.query.userid] } }).then((groups) => {
    res.send(groups);
  });
});

router.post("/join", async (req, res) => {
  try {
    const existingGroup = await Group.findOne({ join_code: req.body.join_code });

    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found." });
    }

    const existingGroupUsers = existingGroup.users;

    if (existingGroupUsers.includes(req.body.userId)) {
      return res.status(400).json({ error: "User is already in the group." });
    }

    existingGroup.users.push(req.body.userId);
    await existingGroup.save();

    res.status(200).json({ message: "User successfully added to the group." });
  } catch (error) {
    console.error("Error adding user to group:", error);
    res.status(500).json({ error: "An error occurred while joining the group." });
  }
});

// generate code
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
