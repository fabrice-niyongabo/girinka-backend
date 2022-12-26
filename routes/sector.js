const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Cows = require("../model/cows");
const SectorCows = require("../model/sectorCows");
const protectRoutes = require("../middleware/protectRoutes");
const getUserLocation = require("../middleware/getUserLocation");

router.post(
  "/",
  auth,
  protectRoutes(["district", "sector"]),
  async (req, res) => {
    try {
      const { cowId, sector } = req.body;
      if (!(cowId && sector)) {
        return res
          .status(400)
          .send({ msg: "Please provide all the information for the cow." });
      }
      const { province, district } = getUserLocation(req);
      const up = await Cows.updateOne(
        { _id: cowId, isTransfered: false },
        { isTransfered: true }
      );
      if (up.modifiedCount > 0) {
        const cow = await SectorCows.create({
          province,
          district,
          cowId,
          sector,
        });
        return res
          .status(201)
          .send({ msg: "Cow transfered successfull.", cow });
      }
      return res
        .status(400)
        .send({ msg: "Something went wrong, try again later after sometime." });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

module.exports = router;
