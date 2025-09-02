import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './user/userRoutes.js';  
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/drepa");
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("MongoDB connection failed, but server will continue:", error.message);
  }
};
connect();
app.use(express.json());

// Simple test endpoint that doesn't require MongoDB
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend connection successful! 🚀',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/users', userRoutes);
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});