import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "health_expert", "admin"],
      required: true,
    },
    gender: { type: String, enum: ["male", "female"] },
    dob: { type: Date },
    phone: { type: String },
    Emergencycontact: { type: String },
    Specialisation: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
