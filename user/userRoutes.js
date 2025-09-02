import express from 'express';
import * as userController from './userControler.js';
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/all', userController.getAllUsers);
router.get('/:userId', userController.getAllUsersById);
router.delete('/:userId', userController.deleteUserById);
router.put('/:userId', userController.updateUserById);
export default router;