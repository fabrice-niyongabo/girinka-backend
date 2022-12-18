const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Cows = require("../model/cows");
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

router.get(
  "/",
  auth,
  protectRoutes(["district", "sector", "cell", "village", "admin"]),
  async (req, res) => {
    const loc = getUserLocation(req);
    try {
      const cows = await Cows.find(loc);
      return res.status(200).send({ cows });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

module.exports = router;
