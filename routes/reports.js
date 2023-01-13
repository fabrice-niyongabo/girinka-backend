const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const protectRoutes = require("../middleware/protectRoutes");
const getUserLocation = require("../middleware/getUserLocation");

const Cows = require("../model/cows");
const Candidates = require("../model/candidates");
const StolenCows = require("../model/stolenCows");
const SickCows = require("../model/sickCows");

router.post("/stolen/", auth, protectRoutes(["village"]), async (req, res) => {
  try {
    const { description, date, candidateId, cowId, status } = req.body;
    if (!(description && date && candidateId && cowId)) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information" });
    }
    const { province, district, sector, cell, village } = getUserLocation(req);
    const candidate = await StolenCows.create({
      description,
      date,
      candidateId,
      cowId,
      province,
      district,
      sector,
      cell,
      village,
    });
    return res
      .status(201)
      .send({ msg: "Cow status updated successfull.", candidate });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.put("/stolen/", auth, protectRoutes(["village"]), async (req, res) => {
  try {
    const { description, date, _id } = req.body;
    if (!_id) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information for the cow." });
    }
    const up = await StolenCows.updateOne({ _id }, { description, date });
    if (up.matchedCount > 0) {
      return res.status(201).send({ msg: "Cow info Updadated!.", up });
    }
    return res
      .status(400)
      .send({ msg: "Something went wrong, try again later after sometime." });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});
router.put(
  "/stolen/approve/",
  auth,
  protectRoutes(["cell", "sector"]),
  async (req, res) => {
    try {
      const { ddescription, status, _id, cowId } = req.body;
      if (!_id) {
        return res
          .status(400)
          .send({ msg: "Please provide all the information for the cow." });
      }
      const upd =
        req.user.role == "cell"
          ? {
              cellApprovalDescription: ddescription,
              cellApproval: status,
              cellApprovalDate: new Date(),
            }
          : {
              sectorApprovalDescription: ddescription,
              sectorApproval: status,
              sectorApprovalDate: new Date(),
            };
      const up = await StolenCows.updateOne({ _id }, upd);
      if (up.matchedCount > 0) {
        if (req.user.role === "sector" && status === "Approved") {
          await Cows.updateOne({ _id: cowId }, { cowStatus: "Stolen" });
          await Candidates.updateOne(
            { assignedCow: cowId },
            { assignedCowStatus: "Stolen" }
          );
        }
        return res.status(201).send({ msg: "Cow info Updadated!.", up });
      }
      return res
        .status(400)
        .send({ msg: "Something went wrong, try again later after sometime." });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);
router.get("/stolen/", auth, async (req, res) => {
  const loc = getUserLocation(req);
  try {
    const candidates = [];
    const cw = await StolenCows.find(loc);
    for (let i = 0; i < cw.length; i++) {
      if (cw[i].cowStatus !== "Waiting") {
        const cow = await Cows.findOne({ _id: cw[i].assignedCow });
        const cand = await Candidates.findOne({ _id: cw[i].candidateId });
        candidates.push({ ...cw[i]._doc, cow, candidate: cand });
      } else {
        candidates.push({ ...cw[i]._doc, cow: {} });
      }
    }
    return res.status(200).send({ cows: candidates });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

//sick cow
router.post("/sick/", auth, protectRoutes(["village"]), async (req, res) => {
  try {
    const {
      description,
      date,
      candidateId,
      cowId,
      status,
      veterinaryName,
      veterinaryPhone,
    } = req.body;
    if (
      !(
        description &&
        date &&
        candidateId &&
        cowId &&
        veterinaryName &&
        veterinaryPhone
      )
    ) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information" });
    }
    const { province, district, sector, cell, village } = getUserLocation(req);
    await Cows.updateOne({ _id: cowId }, { cowStatus: status });
    const candidate = await SickCows.create({
      veterinaryName,
      veterinaryPhone,
      description,
      date,
      candidateId,
      cowId,
      province,
      district,
      sector,
      cell,
      village,
    });
    return res
      .status(201)
      .send({ msg: "Cow status updated successfull.", candidate });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.put("/sick/:id", auth, protectRoutes(["village"]), async (req, res) => {
  try {
    const id = req.params["id"];
    const { description, date } = req.body;
    if (!id) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information for the cow." });
    }
    const up = await StolenCows.updateOne({ _id: id }, { description, date });
    if (up.matchedCount > 0) {
      return res.status(201).send({ msg: "Cow info Updadated!.", up });
    }
    return res
      .status(400)
      .send({ msg: "Something went wrong, try again later after sometime." });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});
router.get("/stolen/", auth, async (req, res) => {
  const loc = getUserLocation(req);
  try {
    const candidates = [];
    const cw = await StolenCows.find(loc);
    for (let i = 0; i < cw.length; i++) {
      if (cw[i].cowStatus !== "Waiting") {
        const cow = await Cows.findOne({ _id: cw[i].assignedCow });
        const cand = await Candidates.findOne({ _id: cw[i].candidateId });
        candidates.push({ ...cw[i]._doc, cow, candidate: cand });
      } else {
        candidates.push({ ...cw[i]._doc, cow: {} });
      }
    }
    return res.status(200).send({ cows: candidates });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

module.exports = router;
