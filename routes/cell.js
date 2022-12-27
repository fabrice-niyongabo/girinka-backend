const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const Cows = require("../model/cows");
const SectorCows = require("../model/sectorCows");
const Candidates = require("../model/candidates");

const protectRoutes = require("../middleware/protectRoutes");
const getUserLocation = require("../middleware/getUserLocation");

router.put(
  "/candidates/:id",
  auth,
  protectRoutes(["cell"]),
  async (req, res) => {
    try {
      const id = req.params["id"];
      const { description, status } = req.body;
      if (!status || !id) {
        return res.status(400).send({
          msg: "Please provide all the information for the candidate.",
        });
      }
      const { province, district, sector, cell } = getUserLocation(req);
      const up = await Candidates.updateOne(
        { _id: id, province, district, sector, cell },
        { cellApproval: status, cellApprovalDescription: description }
      );
      if (up.matchedCount > 0) {
        return res.status(201).send({ msg: "Candidate updated!.", up });
      }
      return res
        .status(400)
        .send({ msg: "Something went wrong, try again later after sometime." });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
);

// router.get(
//   "/",
//   auth,
//   protectRoutes(["district", "sector", "admin"]),
//   async (req, res) => {
//     const loc = getUserLocation(req);
//     try {
//       const cows = [];
//       const cw = await SectorCows.find(loc);
//       for (let i = 0; i < cw.length; i++) {
//         const cow = await Cows.findOne({ _id: cw[i].cowId });
//         cows.push({ ...cw[i]._doc, cow });
//       }
//       return res.status(200).send({ cows });
//     } catch (error) {
//       return res.status(400).send({ msg: error.message });
//     }
//   }
// );

module.exports = router;
