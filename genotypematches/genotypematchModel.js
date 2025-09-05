import mongoose from "mongoose";
const { Schema } = mongoose;

const GenotypeMatchSchema = new Schema({
  patientGenotype: {
    type: String,
    enum: ["AA", "AS", "SS"],
    required: true,
  },
  partnerGenotype: {
    type: String,
    enum: ["AA", "AS", "SS"],
    required: true,
  },
  childPercentages: {
    AA: { type: Number, default: 0 },
    AS: { type: Number, default: 0 },
    SS: { type: Number, default: 0 },
  },
  riskMessage: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GenotypeMatch", GenotypeMatchSchema);
