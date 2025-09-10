import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./user/userRoutes.js";
import genotypematchRoutes from "./genotypematches/genotymatchRoutes.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/drepa");
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log(
      "MongoDB connection failed, but server will continue:",
      error.message
    );
  }
};
connect();
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend connection successful! ",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRoutes);
app.use("/api/genotype-matches", genotypematchRoutes);

// Endpoint: patient sends symptoms → AI gives advice
app.post("/consult", async (req, res) => {
  try {
    const { symptoms } = req.body;

    // Safety rules for emergency symptoms
    if (
      symptoms.toLowerCase().includes("severe pain") ||
      symptoms.toLowerCase().includes("difficulty breathing")
    ) {
      return res.json({
        advice: "⚠ Emergency detected. Please go to the nearest hospital immediately.",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // you can change to openai/gpt-3.5-turbo
        messages: [
          {
            role: "system",
            content: "You are a medical assistant for sickle cell patients. Always give safe, professional advice.",
          },
          {
            role: "user",
            content: `The patient says: ${symptoms}. What should they do?`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ advice: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port} and accessible from other devices`);
});
