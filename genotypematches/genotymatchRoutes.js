import express from "express";

const router = express.Router();
import * as genotypeController from "./genotypematchController.js";
import checkIfAuthenticated from "../middleware/authmiddleware.js";

router.post("/", checkIfAuthenticated, genotypeController.createGenotypeMatch);
router.get(
  "/",
  checkIfAuthenticated,
  genotypeController.getGenotypeMatchesByUser
);
export default router;
