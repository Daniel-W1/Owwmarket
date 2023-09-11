import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
const router = express.Router();

router.route('/auth/signin').post(authController.signin);
router.route('/auth/signout').get(authController.signout);
router.route('/auth/signup').post(userController.create)
router.route('/auth/verify/:token').get(authController.verifyaccount) // this is for verify an email while signing up
router.route('/auth/check/token').post(authController.authenticateToken, authController.loginSuccess) // this for check the validity of token!
// Google OAuth2
router.route('/auth/google').get(authController.google)
router.route('/auth/google/success').post(authController.authenticateToken, authController.loginSuccess)
router.route('/auth/google/failed').get(authController.loginFailed)
router.route('/auth/google/callback').get(authController.callback)
router.route('/auth/google/logout').get(authController.logout)


export default router;