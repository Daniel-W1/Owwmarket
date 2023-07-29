
import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/auth/signin').post(authController.signin);
router.route('/auth/signout').get(authController.signout);

export default router;