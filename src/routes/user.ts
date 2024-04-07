import { Router } from 'express';
import { findInfoUser, getUserById, getUsers, updateAvatar, updateUser } from '../controllers/user';
import { validateUpdateAvatar, validateUpdateUser, validateUserId } from '../validator/validator';

const router = Router();
router.get('', getUsers);
router.get('/:userId', validateUserId, getUserById);
router.get('/me', findInfoUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
export default router;
