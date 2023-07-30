import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authController from '../controllers/auth.controller.js';
import profileController from '../controllers/profile.controller.js';

const router = express.Router()

router.route('/profile/of/:userId').get(profileController.profileByUserId).put(authController.requireSignin, profileController.isOwner, profileController.updateProfile).delete(authController.requireSignin, profileController.isOwner, profileController.remove);
router.route('/profile/:profileId/photo').get(profileController.photo, profileController.defaultPhoto);
router.route('/profile').get(authController.requireSignin, authController.isAdmin, profileController.list)
router.param('userId', userCtrl.userByID);
router.param('profileId', profileController.profileByID);

export default router;