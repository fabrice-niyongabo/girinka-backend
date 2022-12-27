const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Cows = require("../model/cows");
const Candidates = require("../model/candidates");
const protectRoutes = require("../middleware/protectRoutes");
const getUserLocation = require("../middleware/getUserLocation");

router.post("/", auth, protectRoutes(["district"]), async (req, res) => {
  try {
    const {
      cowNumber,
      cowType,
      registrationStatus,
      registrationKg,
      supplierName,
    } = req.body;

    if (
      !(
        cowNumber &&
        cowType &&
        registrationStatus &&
        registrationKg &&
        supplierName
      )
    ) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information for the cow." });
    }

    const oldNumber = await Cows.find({ cowNumber });

    if (oldNumber.length > 0) {
      return res.status(400).send({ msg: "Cow number already exists." });
    }

    const { province, district } = getUserLocation(req);

    const cow = await Cows.create({
      cowNumber,
      cowType,
      registrationStatus,
      registrationKg,
      supplierName,
      province,
      district,
    });
    return res.status(201).send({ msg: "Cow registered successfull.", cow });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.delete("/:id", auth, protectRoutes(["district"]), async (req, res) => {
  try {
    const id = req.params["id"];
    const trans = await Cows.findOne({ _id: id, isTransfered: true });
    if (trans) {
      return res.status(400).send({
        msg: "You can not delete a cow which has been already transfered",
      });
    }
    await Cows.deleteOne({ _id: id });
    return res.status(200).send({ msg: "Cow delete successfull." });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.get(
  "/",
  auth,
  protectRoutes(["district", "sector", "cell", "village", "admin"]),
  async (req, res) => {
    const loc = getUserLocation(req);
    try {
      const cows = [];
      const cws = await Cows.find(loc);
      for (let i = 0; i < cws.length; i++) {
        if (cws[i].isGiven) {
          const candidate = await Candidates.findOne({ _id: cws[i].givenTo });
          cows.push({ ...cws[i]._doc, candidate });
        } else {
          cows.push({ ...cws[i]._doc, candidate: {} });
        }
      }
      return res.status(200).send({ cows });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

router.put(
  "/:id",
  auth,
  protectRoutes(["district", "admin"]),
  async (req, res) => {
    const id = req.params["id"];
    const { cowType, registrationStatus, registrationKg, supplierName } =
      req.body;
    try {
      const cows = await Cows.updateOne(
        { _id: id },
        { cowType, registrationStatus, registrationKg, supplierName }
      );
      return res.status(200).send({ cows, msg: "Cow updated successfull" });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

module.exports = router;
