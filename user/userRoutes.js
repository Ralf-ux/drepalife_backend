import express from "express";
import * as userController from "./userControler.js";
import checkIfAuthenticated from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/all", checkIfAuthenticated, userController.getAllUsers);
router.get("/:userId", checkIfAuthenticated, userController.getAllUsersById);
router.delete("/:userId", checkIfAuthenticated, userController.deleteUserById);
router.put("/:userId", checkIfAuthenticated, userController.updateUserById);
export default router;
