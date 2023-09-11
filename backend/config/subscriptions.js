import cron from 'node-cron';
import userController from '../controllers/user.controller.js';

cron.schedule('0 0 * * *', () => { // run every 24hours 
    userController.checkSubscriptions()
    .then(() => {
      console.log('Subscription check completed.');
    })
    .catch((error) => {
      console.error('Error checking subscriptions:', error);
    });
});


export default cron;