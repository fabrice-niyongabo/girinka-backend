const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const Cows = require("../model/cows");
const SectorCows = require("../model/sectorCows");
const Candidates = require("../model/candidates");
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
router.put("/", auth, protectRoutes(["sector"]), async (req, res) => {
  try {
    const { cowId } = req.body;
    if (!cowId) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information for the cow." });
    }
    const up = await Cows.updateOne(
      { _id: cowId },
      { receivedBy: req.user.user_id, isReceived: true }
    );
    if (up.matchedCount > 0) {
      await SectorCows.updateOne(
        { cowId },
        { receivedBy: req.user.user_id, isReceived: true }
      );
      return res.status(201).send({ msg: "Cow received.", up });
    }
    return res
      .status(400)
      .send({ msg: "Something went wrong, try again later after sometime." });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.put(
  "/candidates/:id",
  auth,
  protectRoutes(["sector"]),
  async (req, res) => {
    try {
      const id = req.params["id"];
      const { description, status } = req.body;
      if (!status || !id) {
        return res.status(400).send({
          msg: "Please provide all the information for the candidate.",
        });
      }
      const { province, district, sector } = getUserLocation(req);
      const up = await Candidates.updateOne(
        { _id: id, province, district, sector },
        { sectorApproval: status, sectorApprovalDescription: description }
      );
      if (up.matchedCount > 0) {
        return res.status(201).send({ msg: "Candidate udpdated!.", up });
      }
      console.log(up);
      return res
        .status(400)
        .send({ msg: "Something went wrong, try again later after sometime." });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

router.get(
  "/",
  auth,
  protectRoutes(["district", "sector", "admin"]),
  async (req, res) => {
    const loc = getUserLocation(req);
    try {
      const cows = [];
      const cw = await SectorCows.find(loc);
      for (let i = 0; i < cw.length; i++) {
        const cow = await Cows.findOne({ _id: cw[i].cowId });
        if (cw[i].isGiven) {
          const candidate = await Candidates.findOne({ _id: cw[i].givenTo });
          cows.push({ ...cw[i]._doc, cow, candidate });
        } else {
          cows.push({ ...cw[i]._doc, cow, candidate: {} });
        }
      }
      return res.status(200).send({ cows });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

module.exports = router;
