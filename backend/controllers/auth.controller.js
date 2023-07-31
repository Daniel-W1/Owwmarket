import { expressjwt } from "express-jwt"
import UserSchema from "../models/user.shema.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/user.shema.js"
dotenv.config()

const signin = async (req, res) => {
    try {
        let user = await UserSchema.findOne({
            "email": req.body.email
        })
        if (!user)
            return res.status(401).json({
                success: false,
                error: "User not found"
            })
        if (!user.authenticate(req.body.password)) {
            return res.status(401).send({
                success: false,
                error: "Email and password don't match."
            })
        }

        const token = jwt.sign({
            _id: user._id,
            admin: user.admin,
        }, process.env.JWT_SECRET)

        // console.log(process.env.JWT_SECRET);

        res.cookie("t", token, {
            expire: new Date() + 9999
        })

        return res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, admin: user.admin, seller: user.seller }
        })

    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Could not sign in"
        })
    }
}

const signout = (req, res) => {
    res.clearCookie("t")
    return res.status(200).json({
        success: true,
        message: "signed out"
    })
}

// console.log(process.env.JWT_SECRET);

const requireSignin = expressjwt(
    {
        secret: process.env.JWT_SECRET || 'thisisadefaultsecret',
        userProperty: 'auth',
        algorithms: ['HS256']
    }
)


const hasAuthorization = async (req, res, next) => {
    let id = req.auth._id
    const userRequesting = await UserSchema.findById(id)
    const authorized = req.profile && req.auth && req.profile._id.equals(userRequesting._id);
    
    // if the user is an admin, they are authorized
    if (userRequesting.admin === true) {
        next()
    }

    if (!authorized) {
        return res.status(403).json({
            success: false,
            error: "User is not authorized"
        })
    }
    next()
}

const isAdmin =  async (req, res, next) => {
    
    try {
        let id = req.auth._id
        let user = await UserSchema.findById(id)
    
        // console.log(user);
        if (user.admin === false) {
            return res.status(403).json({
                success: false,
                error: "Admin resourse! Access denied"
            })
        }
        next()
        
    } catch (error) {
        return res.status(403).json({
            success: false,
            error: "Admin resourse! Access denied"
        })
    }
}

export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization,
    isAdmin
}