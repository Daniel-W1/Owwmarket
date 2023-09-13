import { User, GoogleUser } from '../models/user.schema.js'
import _ from 'lodash'
import errorHandler from '../helpers/dbhelper.js'
import Profile from '../models/profile.schema.js'
import transporter from '../config/nodemailer.js'
import Subscription from '../models/subscription.schema.js'
import Payment from '../models/payment.schema.js'
import Log from '../models/log.schema.js'
import Stripe from 'stripe';
const stripe = Stripe('sk_test_51KGSeNAwm0p9ZmAu7G1vQ0xfZ4PdMcY5sQyO1ulZmj81JPQ4cuyo41E4xKcjrdNChFBelfo2dqYRgqcwU8KthQ6l00Px553QYw')

const create = async (req, res) => {
    const { name, email, password, gmaildata } = req.body;
    try {
        let userExists = await User.findOne({ "email": email })
        if (userExists){
        return res.status(403).json({
            success: false,
            error: userExists.googleID ?  "This email address uses Google Sign-in" :"Email is already taken!"
        })}
        let user;
        const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if(gmaildata) {
             user = new GoogleUser({
                name: gmaildata.displayName,
                email: email,
                googleID: gmaildata.id,
                gmaildata: gmaildata,
                isVerified: true
              });
        } else { 
             user = new User({
                name: name,
                email: email,
                password: password,
                verificationToken: verificationToken
            })   
        }
        await user.save()
        
        // let's create the skeleton for the user's profile
        const profile = new Profile({
            name: user.name,
            email: user.email,
            owner: user._id,
            following: [],
            followers: [],
            location: '',
            bio: '',
            image: { data: '', contentType: ''}
        })
        
        await profile.save()
         res.status(200).json({
            success: true,
            message: "Successfully Signing up, please Verify your account to access your account!"
        })
        
        if(!user.googleID) {
            const senderName = 'OwwMarket';
            const senderEmail = 'noreply@owwmarket.store';
            const supportEmail = 'support@owwmarket.store'
        const mailOptions = {
            from: `"${senderName}" <${senderEmail}>`,
            to: user.email,
            subject: 'Email Verification',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header img {
                        max-width: 200px;
                        height: auto;
                    }
                    .message {
                        text-align: center;
                        margin-bottom: 30px;
                        padding: 0 20px;
                    }
                    .message h1 {
                        font-size: 24px;
                        color: #333333;
                    }
                    .message p {
                        font-size: 18px;
                        line-height: 1.6;
                        color: #555555;
                    }
                    .button {
                        text-align: center;
                        margin-top: 30px;
                    }
                    .button a {
                        display: inline-block;
                        padding: 15px 40px;
                        background-color: #007bff; /* Button background color */
                        color: #ffffff; /* Button text color */
                        text-decoration: none;
                        border-radius: 30px;
                        font-size: 20px;
                        transition: background-color 0.3s ease-in-out;
                    }
                    .button a:hover {
                        background-color: #0056b3; /* Hover background color */
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 14px;
                        color: #888888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="your_logo_url_here" alt="Your Logo">
                    </div>
                    <div class="message">
                        <h1>Hello ${user.name},</h1>
                        <p>Thank you for signing up! To verify your account, please click the button below:</p>
                    </div>
                    <div class="button">
                        <a href="http://localhost:3000/auth/verify/${verificationToken}">Verify Your Account</a>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, please contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
                    </div>
                </div>
            </body>
            </html>
            `
        };
        await transporter.sendMail(mailOptions);
        }

        
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const userByID = async (req, res, next) => { 
    try {
        var { userId } = req.params;
        const user = await User.findById(userId);
        // console.log('we are here', user);
        if (!user)
            return res.status(400).json({
                success: false,
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: "Could not retrieve user"
        })
    }
 }
 
const read = async (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const update = async (req, res, next) => {
    try {
        let user = req.profile
        user = _.extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const remove = async (req, res, next) => {
    try {
        let user = req.profile
        let deletedUser = await User.findByIdAndDelete(req.profile._id)
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const isSeller = (req, res, next) => {
    const isSeller = req.profile && req.profile.seller
    if (!isSeller) {
        return res.status(403).json({
            success: false,
            error: "User is not a seller"
        })
    }
    next()
}

const isSubscribed = (req, res, next) => {
  const isSubscribed = req.profile && req.profile.isSubscribed;
  if (!isSubscribed) {
    return res.status(403).json({
      success: false,
      error: "there are no active subscriptions associated with this user.",
    });
  }
  next();
};
const readSubscription = async (req, res) => {
  const subs = await Subscription.findOne({ owner: req.profile._id });
  if (!subs) {
    return res.status(403).json({
      success: false,
      error: "there are no active subscriptions associated with this user.",
    });
  }
  res.json({
    success: true,
    isSubscribed: true,
    subscription: subs,
  });
};
const createSubscription = async (req, res, next) => {
  const isSubscribed = req.profile && req.profile.isSubscribed;
  if (isSubscribed) {
    return res.status(403).json({
      success: false,
      error: "already have a subscriptions associated with this user!",
    });
  }
  var { planName, duration, startDate } = req.body;
  const endDate = addDaysToDate(startDate ? startDate : new Date(), duration ? duration : req.subsdata.duration); // duration by days!

  try {
    const user = await User.findById(req.profile._id);
    const subscription = new Subscription({
      owner: user._id,
      planName: planName ? planName : req.subsdata.planName,
      duration: duration ? duration : req.subsdata.duration,
      startDate: startDate ? startDate : new Date(),
      endDate: endDate,
    });
    user.isSubscribed = true;
    user.subscription = subscription;

    await user.save();
    await subscription.save();
    
    if(req.subsdata) {
       res.redirect(`${process.env.CLIENT_URL}/subscribe/success`)
    } else {    
      res.json({
        success: true,
        subscription,
      });
    }
    const log = new Log({
      user: user._id,
      resource: "user",
      action: "subscriptionadd",
      resourceid: user._id,
      description: `Subscription added for ${user.name}`,
      details: subscription._id,
    });
    await log.save();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: errorHandler.getErrorMessage(error),
    });
  }

  function addDaysToDate(date, daysToAdd) {
    const newDate = new Date(date);
    const daysToAddAsInt = parseInt(daysToAdd, 10);
    if (!isNaN(daysToAddAsInt)) {
      newDate.setDate(newDate.getDate() + daysToAddAsInt);
    }
    return newDate;
  }
};
async function removeUserSubscription(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return; // User not found
    }

    const removedSubscription = await Subscription.findOneAndDelete({
      owner: userId,
    });
    user.isSubscribed = false;
    user.subscription = undefined;

    await user.save();

    // Log the subscription end
    const log = new Log({
      user: userId,
      resource: "user",
      action: "subscriptionend",
      resourceid: userId,
      description: `Subscription for ${user.name} has expired`,
      details: removedSubscription._id,
    });
    await log.save();
  } catch (error) {
    console.error("Error removing user subscription:", error);
  }
}
// Original removeSubscription function
const removeSubscription = async (req, res) => {
  try {
    const subs = await Subscription.findOne({ owner: req.profile._id });
    if (!subs) {
      return res.status(403).json({
        success: false,
        error: "There are no active subscriptions associated with this user.",
      });
    }

    await removeUserSubscription(req.profile._id);

    res.json({
      success: true,
      subscription: subs,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Function to check if a subscription has expired
function hasSubscriptionExpired(subscriptionEndDate) {
  const currentDate = new Date();
  return currentDate > new Date(subscriptionEndDate);
}

function formatDate(date) {
    const options = { 
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-GB', options);
  }

// Function to check and update subscription statuses
async function checkSubscriptions() {
  try {
    const usersWithSubscriptions = await User.find({ isSubscribed: true });
    const removedSubs = [];
    for (const user of usersWithSubscriptions) {
        const subscription = await Subscription.findOne({ owner: user._id });
      if (hasSubscriptionExpired(subscription.endDate)) {
        await removeUserSubscription(user._id);
        removedSubs.push(subscription)
      }
    }
        let log;
    if(removedSubs.length >= 1) {
         log = new Log({
          user: "system",
          action: "removesubscriptions",
          description: `${
            removedSubs.length > 1
              ? `${removedSubs.length} subscriptions`
              : `${removedSubs.length} subscription`
          } has been expired!`,
          details: { removedSubs
          },
        });

        await log.save();
    } 
    const checklog = new Log({
        user: "system",
        action: "checksubscriptions",
        description: `${log ? `true` : `false`} check at ${formatDate(new Date())} ${log ? `log: ${log._id}` : `without subs`}`,
        details: log ? { removelog: log._id } : null,
      });
  
      await checklog.save();

    // Log the removed users
    console.log("Subscription check completed.");
  } catch (error) {
    console.error("Error checking subscriptions:", error);
  }
}

const SubsType = new Map([
  [1, { priceInCents: 100, name: "Premuim" }],
  [2, { priceInCents: 500, name: "Gold" }],
]);

const createPayment = async (req, res) => {
  try {
    var token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const lineItems = req.body.items.map((item) => {
      const Subs = SubsType.get(item.id);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: Subs.name,
          },
          unit_amount: Subs.priceInCents,
        },
        quantity: 1,
      };
    });

    const amount = lineItems.reduce(
      (total, lineItem) => total + lineItem.price_data.unit_amount,
      0
    );

    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `http://localhost:3000/payment/success/${token}`,
      cancel_url: `http://localhost:3000/payment/failed`,
    });
    const payment = new Payment({
      user: req.body.userId,
      token: token,
      amount: amount,
      status: 'pending',
      details: req.body.items[0]
    });
    await payment.save();
    console.log(session)
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const paymentToken = async (req, res, next) => {
  try {
    var { token } = req.params;
    const payment = await Payment.findOne({ token: token }).populate("user");
    if (!payment || payment.status === "succeeded" || payment.status === "failed") return res.redirect("/payment/failed");
    payment.status = "succeeded";
    await payment.save();
    req.profile = payment.user;
    req.subsdata = {
      planName: payment.details.name,
      duration: 31
    }
    next();
  } catch (error) {
    console.log("err", error);
  }
};

const paymentFailed = (req, res) => {
  return res.json({
    success: false,
    message: "Payment Failed!"
  })
}

export default { create, userByID, read, list, remove, update, isSeller, isSubscribed, readSubscription, createSubscription, removeSubscription, checkSubscriptions, createPayment, paymentToken, paymentFailed }