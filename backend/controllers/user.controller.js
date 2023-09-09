import { User, GoogleUser } from '../models/user.schema.js'
import _ from 'lodash'
import errorHandler from '../helpers/dbhelper.js'
import Profile from '../models/profile.schema.js'
import transporter from '../config/nodemailer.js'

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

export default { create, userByID, read, list, remove, update, isSeller }