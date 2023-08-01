import { User, GoogleUser } from '../models/user.schema.js'
import _ from 'lodash'
import errorHandler from '../helpers/dbhelper.js'
import Profile from '../models/profile.schema.js'

const create = async (req, res) => {
    const { name, email, password, gmaildata } = req.body;
    try {
        let userExists = await User.findOne({ "email": email })
        if (userExists)
        return res.status(403).json({
            success: false,
            error: "Email is already taken!"
        })
        let user;
        if(gmaildata) {
             user = new GoogleUser({
                name: gmaildata.displayName,
                email: email,
                googleID: gmaildata.id,
                gmaildata: gmaildata
              });
        } else {
             user = new User({
                name,
                email,
                password 
            })     
        }
        await user.save()
        // let's create the skeleton for the user's profile
        const profile = Profile({
            name: user.name,
            email: user.email,
            owner: user._id
        })
        await profile.save()
        
        // return res.status(200).json({
        //     success: true,
        //     message: "Successfully Created!"
        // })
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

const userByID = async (req, res, next, id) => { 
    try {
        const user = await User.findById(id);
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