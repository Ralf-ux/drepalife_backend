import GenotypeMatch from "./genotypematchModel.js";
import { computePunnettSquare, generateRiskMessage } from "../utils/helper.js";

export const createGenotypeMatch = async (req, res) => {
  try {
    const { patientGenotype, partnerGenotype } = req.body;

    const validGenotypes = ["AA", "AS", "SS"];
    if (
      !validGenotypes.includes(patientGenotype) ||
      !validGenotypes.includes(partnerGenotype)
    ) {
      return res
        .status(200)
        .json({ message: "Invalid genotype input", success: false });
    }
    const childPercentages = computePunnettSquare(
      patientGenotype,
      partnerGenotype
    );

    const riskMessage = generateRiskMessage(childPercentages);

    const newMatch = await GenotypeMatch.create({
      patientGenotype,
      partnerGenotype,
      childPercentages,
      riskMessage,
      userId: req.user._id,
    });
    return res.status(200).json({
      success: true,
      message: "Genotype match calculated successfully",
      data: newMatch,
    });
  } catch (error) {
    console.error("Genotype match error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getGenotypeMatchesByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const matches = await GenotypeMatch.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: matches });
  } catch (error) {
    console.error("Fetch genotype matches error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }   }