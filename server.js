import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import HealthTip from "./models/HealthTip.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

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

// Health Tips CRUD endpoints

// Get all health tips
app.get("/health-tips", async (req, res) => {
  try {
    const tips = await HealthTip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new health tip
app.post("/health-tips", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newTip = new HealthTip({ title, content });
    await newTip.save();
    res.status(201).json(newTip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a health tip by ID
app.put("/health-tips/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedTip = await HealthTip.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!updatedTip) {
      return res.status(404).json({ error: "Health tip not found" });
    }
    res.json(updatedTip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a health tip by ID
app.delete("/health-tips/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTip = await HealthTip.findByIdAndDelete(id);
    if (!deletedTip) {
      return res.status(404).json({ error: "Health tip not found" });
    }
    res.json({ message: "Health tip deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
