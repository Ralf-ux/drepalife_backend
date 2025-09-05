import userModel from "./userModel.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      name,
      useremail,
      password,
      phone,
      emergencycontact,
      specialisation,
      role,
      gender,
    } = req.body;

    console.log(req.body, "=========================");
    if (role === "healthexpert" && !specialisation) {
      return res.status(400).json({
        message: "Specialisation is required for health experts",
        success: false,
      });
    }
    const existingUser = await userModel.findOne({ email: useremail });
    if (existingUser) {
      console.log("here=========================");

      return res.status(200).json({
        message: "This email is taken. Try signing in instead.",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await userModel.create({
      name,
      email: useremail,
      password: hashedPassword,
      role,
      phone,
      gender,
      Emergencycontact: emergencycontact,
      Specialisation: specialisation,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: newuser,
      success: true,
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { useremail, password } = req.body;
    const user = await userModel.findOne({ email: useremail });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Invalid email or password", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res
      .status(200)
      .json({ message: "Login successful", token, success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, success });
  }
};

export const getAllUsersById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findById({ _id: userId });

    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateUserProfileInfo = await userModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      req.body,
      { new: true }
    );
    if (!updateUserProfileInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", updateUserProfileInfo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
