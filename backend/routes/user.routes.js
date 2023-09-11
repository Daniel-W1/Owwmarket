import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authController from '../controllers/auth.controller.js';

const router = express.Router()

router.route('/users').get(authController.requireSignin, authController.isAdmin, userCtrl.list).post(userCtrl.create);
router.route('/users/:userId').get(authController.requireSignin, userCtrl.read).put(authController.requireSignin, authController.hasAuthorization, userCtrl.update).delete(authController.requireSignin, authController.hasAuthorization, userCtrl.remove);
router.param('userId', userCtrl.userByID);

// Subscription
router.route('/users/:userId/subscription').get(userCtrl.isSubscribed, userCtrl.readSubscription).post(userCtrl.createSubscription).delete(userCtrl.isSubscribed, userCtrl.removeSubscription)

export default router;