import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// Protected routes
router.get('/profile', authenticate, userController.getProfile.bind(userController));
router.put('/profile', authenticate, userController.updateProfile.bind(userController));
router.delete('/profile', authenticate, userController.deleteProfile.bind(userController));
router.put('/change-password', authenticate, userController.changePassword.bind(userController));

// Admin routes
router.get('/', authenticate, userController.getUsers.bind(userController));
router.post('/', authenticate, userController.createUser.bind(userController));
router.put('/:id', authenticate, userController.updateUser.bind(userController));
router.delete('/:id', authenticate, userController.deleteUser.bind(userController));

export default router; 