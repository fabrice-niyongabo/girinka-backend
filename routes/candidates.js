const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const protectRoutes = require("../middleware/protectRoutes");
const getUserLocation = require("../middleware/getUserLocation");

const Cows = require("../model/cows");
const Candidates = require("../model/candidates");

router.post("/", auth, protectRoutes(["village"]), async (req, res) => {
  try {
    const { names, idNo, ubudeheCategory, phone, martialStatus } = req.body;
    if (!(names && idNo)) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information for the cow." });
    }
    const { province, district, sector, cell, village } = getUserLocation(req);

    const candidate = await Candidates.create({
      names,
      idNo,
      ubudeheCategory,
      phone,
      martialStatus,
      province,
      district,
      sector,
      cell,
      village,
    });
    return res
      .status(201)
      .send({ msg: "Candidate recorded successfull.", candidate });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.put("/:id", auth, protectRoutes(["village"]), async (req, res) => {
  try {
    const id = req.params["id"];
    const { names, idNo, ubudeheCategory, phone, martialStatus } = req.body;
    if (!id) {
      return res
        .status(400)
        .send({ msg: "Please provide all the information for the cow." });
    }
    const up = await Candidates.updateOne(
      { _id: id },
      { names, idNo, ubudeheCategory, phone, martialStatus }
    );
    if (up.matchedCount > 0) {
      return res.status(201).send({ msg: "Candidate Updadated!.", up });
    }
    return res
      .status(400)
      .send({ msg: "Something went wrong, try again later after sometime." });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.delete(
  "/:id",
  auth,
  protectRoutes(["village", "admin"]),
  async (req, res) => {
    try {
      const id = req.params["id"];
      if (!id) {
        return res.status(400).send({
          msg: "Please provide all the information for the candidate.",
        });
      }
      const up = await Candidates.deleteOne({
        _id: id,
        cellApproval: "Pending",
        sectorApproval: "Pending",
      });
      if (up.deletedCount > 0) {
        return res.status(201).send({ msg: "Candidate removed successful." });
      }
      return res.status(400).send({
        msg: "You can not delete candidate who has been approved by the cell or sector.",
      });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

router.get("/", auth, async (req, res) => {
  const loc = getUserLocation(req);
  try {
    const candidates = [];
    const cw = await Candidates.find(loc);
    for (let i = 0; i < cw.length; i++) {
      if (cw[i].cowStatus !== "Waiting") {
        const cow = await Cows.findOne({ _id: cw[i].assignedCow });
        candidates.push({ ...cw[i]._doc, cow });
      } else {
        candidates.push({ ...cw[i]._doc, cow: {} });
      }
    }
    return res.status(200).send({ candidates });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

module.exports = router;
