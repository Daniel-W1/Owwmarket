
import express from 'express';
import authController from '../controllers/auth.controller.js';
const router = express.Router();

router.route('/auth/signin').post(authController.signin);
router.route('/auth/signout').get(authController.signout);

// Google OAuth2
router.route('/auth/google').get(authController.google)
router.route('/auth/google/success').post(authController.authenticateToken, authController.loginSuccess)
router.route('/auth/google/failed').get(authController.loginFailed)
router.route('/auth/google/callback').get(authController.callback)
router.route('/auth/google/logout').get(authController.logout)


export default router;