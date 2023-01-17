const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Announcements = require("../model/announcements");
const Candidates = require("../model/candidates");
const protectRoutes = require("../middleware/protectRoutes");
const getUserLocation = require("../middleware/getUserLocation");

router.post("/", auth, async (req, res) => {
  try {
    const { title, location, attachment, names } = req.body;

    if (!(title && location && attachment && names)) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information." });
    }

    const { province, district } = getUserLocation(req);

    const cow = await Announcements.create({
      title,
      location,
      attachment,
      names,
      userId: req.user.user_id,
    });
    return res.status(201).send({ msg: "Announcement posted.", cow });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params["id"];
    await Announcements.deleteOne({ _id: id });
    return res.status(200).send({ msg: "Announcement delete successfull." });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const announcements = await Announcements.find({
      userId: req.user.user_id,
    });
    return res.status(200).send({ msg: "Announcements.", announcements });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.get("/all/", async (req, res) => {
  try {
    const announcements = await Announcements.find({});
    return res.status(200).send({ msg: "Announcements.", announcements });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

module.exports = router;
