import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./user/userRoutes.js";
import genotypematchRoutes from "./genotypematches/genotymatchRoutes.js";
import axios from "axios";
import dotenv from "dotenv";
import HealthTip from "./models/HealthTip.js";
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


app.post("/consult", async (req, res) => {
  try {
    console.log("🔑 API Key:", process.env.OPENROUTER_API_KEY);
    console.log("📩 Incoming body:", req.body);

    const { symptoms } = req.body;

    // ✅ Check API key before anything else
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error:
          "OpenRouter API key is missing. Please set OPENROUTER_API_KEY in your .env file.",
      });
    }

    // ✅ Safety rules for emergency symptoms
    if (
      symptoms?.toLowerCase().includes("severe pain") ||
      symptoms?.toLowerCase().includes("difficulty breathing")
    ) {
      return res.json({
        advice:
          "⚠ Emergency detected. Please go to the nearest hospital immediately.",
      });
    }

    console.log("✅ Proceeding with symptoms:", symptoms);

   const response = await axios.post(
     "https://openrouter.ai/api/v1/chat/completions",
     {
       model: "openai/gpt-3.5-turbo",
       messages: [
         { role: "system", content: "You are a medical assistant..." },
         { role: "user", content: `Patient says: ${symptoms}` },
       ],
       max_tokens: 500,
       temperature: 0.7,
     },
     {
       headers: {
         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
         "Content-Type": "application/json",
       },
     }
   );

    console.log("✅ OpenRouter response received");
    res.json({ advice: response.data.choices[0].message.content });
  } catch (error) {
    console.error(
      "❌ Consult API error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error:
        error.response?.data?.error ||
        error.message ||
        "Something went wrong with the consult service.",
    });
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

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port} and accessible from other devices`);
});
