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
const Comment = require("./models/comment");
const Badge = require("./models/badges");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const { UNSAFE_useRouteId } = require("react-router-dom");

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
router.get("/user", async (req, res) => {
  User.findById(req.query.userid)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send("User Not Found");
    });
});

router.get("/userDailyPicture", async (req, res) => {
  User.findById(req.query.userid)
    .then((user) => {
      res.send({ dailyPicture: user.dailyPicture });
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

router.get("/allUserBadges", (req, res) => {
  Badge.find({ category: "user" }).then((badges) => {
    res.send(badges);
  });
});

router.get("/allGroupBadges", (req, res) => {
  Badge.find({ category: "group" }).then((badges) => {
    res.send(badges);
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
    const user = await User.findOne({ _id: user_id });
    const groups = await Group.find({ users: { $in: [user_id] } });

    user.dailyPicture = uploadResult.Location;

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

      user.currentStreak = user.currentStreak + 1;
      user.highestStreak = Math.max(user.highestStreak, user.currentStreak);

      if (user.currentStreak >= 3) {
        const badge = await Badge.findOne({
          badge_description: "Complete the challenge 3 days in a row",
        });

        if (badge && !user.badges.includes(badge._id)) {
          user.badges.push(badge._id);
        }
      }

      if (user.currentStreak >= 7) {
        const badge = await Badge.findOne({
          badge_description: "Complete the challenge 7 days in a row",
        });

        if (badge && !user.badges.includes(badge._id)) {
          user.badges.push(badge._id);
        }
      }

      if (user.currentStreak >= 30) {
        const badge = await Badge.findOne({
          badge_description: "Complete the challenge 30 days in a row",
        });

        if (badge && !user.badges.includes(badge._id)) {
          user.badges.push(badge._id);
        }
      }

      user.completedDaily = true;
      await user.save();

      for (const group of groups) {
        let allUploaded = true;

        const userChecks = group.users
          .filter((user) => user !== user_id)
          .map(async (user) => {
            const currentUser = await User.findOne({ _id: user });
            if (!currentUser || currentUser.dailyPicture === "") {
              allUploaded = false;
            }
          });

        await Promise.all(userChecks);

        if (allUploaded) {
          group.currentStreak += 1;
          group.longestStreak = Math.max(group.longestStreak, group.currentStreak);
          group.completedDaily = true;

          if (group.currentStreak >= 3) {
            const badge = await Badge.findOne({
              badge_description: "Everyone uploads for 3 days in a row",
            });

            if (badge && !group.badges.includes(badge._id)) {
              group.badges.push(badge._id);
            }
          }

          if (group.currentStreak >= 7) {
            const badge = await Badge.findOne({
              badge_description: "Everyone uploads for 7 days in a row",
            });

            if (badge && !group.badges.includes(badge._id)) {
              group.badges.push(badge._id);
            }
          }

          if (group.currentStreak >= 30) {
            const badge = await Badge.findOne({
              badge_description: "Everyone uploads for 30 days in a row",
            });

            if (badge && !group.badges.includes(badge._id)) {
              group.badges.push(badge._id);
            }
          }

          group.save();
        }
      }

      await newPicture.save();

      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl: uploadResult.Location,
        pictureId: newPicture._id,
      });
      user.save();
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

router.post("/uploadProfilePicture", upload.single("file"), async (req, res) => {
  const { user_id, challenge } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  // Validate file type and size
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ error: "Invalid file type. Only JPEG, PNG, and GIF are allowed." });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    return res.status(400).json({ error: "File is too large. Max size is 5MB." });
  }

  const fileContent = req.file.buffer;
  const fileName = `uploads/${user_id}/${Date.now()}_${req.file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
    ContentType: req.file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(params).promise();

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.profilePicture = uploadResult.Location;

    try {
      await user.save();
      return res.status(200).json({
        message: "Profile picture uploaded successfully",
        fileUrl: uploadResult.Location,
        pictureId: 0, // why is this needed?
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to save user profile picture", details: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to upload image to S3", details: error.message });
  }
});

router.get("/challenge", async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ date: req.query.date });

    if (challenge) {
      if (challenge.isReady) {
        // Send the challenge if it's ready
        res.send(challenge);
      } else {
        // If the challenge exists but isn't ready yet
        res.status(202).json({
          message: "Challenge not ready yet. Please try again later.",
        });
      }
    } else {
      // If no challenge is found for the date
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
router.post("/newgroup", async (req, res) => {
  try {
    const newGroup = new Group({
      join_code: req.body.join_code,
      group_name: req.body.group_name,
      users: req.body.users,
    });

    const group = await newGroup.save();

    const groups = await Group.find({ users: { $in: [req.body.userId] } });

    if (groups.length >= 3) {
      const user = await User.findOne({ _id: req.body.userId });
      console.log(user);

      if (user) {
        const groupBadge = await Badge.findOne({
          badge_description: "Create or join 3 or more groups",
        });

        if (groupBadge && !user.badges.includes(groupBadge._id)) {
          user.badges.push(groupBadge._id);
          await user.save();
        }
      }
    }

    res.send(group);
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// geting groups based on userid
router.get("/group", (req, res) => {
  Group.find({ users: { $in: [req.query.userid] } }).then((groups) => {
    res.send(groups);
  });
});

router.get("/groupById", (req, res) => {
  Group.findOne({ _id: req.query.groupId }).then((group) => {
    res.send(group);
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

    if (existingGroup.users.length >= 5) {
      const groupBadge = await Badge.findOne({
        badge_description: "Have 5 or more people in this group",
      });

      if (groupBadge && !existingGroup.badges.includes(groupBadge._id)) {
        existingGroup.badges.push(groupBadge._id);
      }
    }

    if (existingGroup.users.length >= 10) {
      const groupBadge = await Badge.findOne({
        badge_description: "Have 10 or more people in this group",
      });

      if (groupBadge && !existingGroup.badges.includes(groupBadge._id)) {
        existingGroup.badges.push(groupBadge._id);
      }
    }

    await existingGroup.save();

    const groups = await Group.find({ users: { $in: [req.body.userId] } });

    if (groups.length >= 3) {
      const user = await User.findOne({ _id: req.body.userId });

      if (user) {
        const groupBadge = await Badge.findOne({
          badge_description: "Create or join 3 or more groups",
        });

        if (groupBadge && !user.badges.includes(groupBadge._id)) {
          user.badges.push(groupBadge._id);
          await user.save();
        }
      }
    }

    res.status(200).json({ message: "User successfully added to the group." });
  } catch (error) {
    console.error("Error adding user to group:", error);
    res.status(500).json({ error: "An error occurred while joining the group." });
  }
});

router.post("/leavegroup", async (req, res) => {
  try {
    const existingGroup = await Group.findOne({ _id: req.body.groupId });

    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found." });
    }

    const userIdToRemove = req.body.userId;
    existingGroup.users = existingGroup.users.filter((userId) => userId !== userIdToRemove);

    const badgesToRemove = [];

    if (existingGroup.users.length < 5) {
      const groupBadge = await Badge.findOne({
        badge_description: "Have 5 or more people in this group",
      });

      if (groupBadge && existingGroup.badges.includes(groupBadge._id)) {
        badgesToRemove.push(groupBadge._id);
      }
    }

    if (existingGroup.users.length < 10) {
      const groupBadge = await Badge.findOne({
        badge_description: "Have 10 or more people in this group",
      });

      if (groupBadge && existingGroup.badges.includes(groupBadge._id)) {
        badgesToRemove.push(groupBadge._id);
      }
    }

    existingGroup.badges = existingGroup.badges.filter(
      (badgeId) =>
        !badgesToRemove.some((badgeToRemove) => badgeId.toString() === badgeToRemove.toString())
    );

    await existingGroup.save();

    res.status(200).json({ message: "User successfully removed from the group." });
  } catch (error) {
    console.error("Error removing user from group:", error);
    res.status(500).json({ error: "An error occurred while leaving the group." });
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

router.get("/comment", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

router.post("/comment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new Comment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    parent: req.body.parent,
    content: req.body.content,
  });

  newComment.save().then((comment) => res.send(comment));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
