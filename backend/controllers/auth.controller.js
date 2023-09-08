import { expressjwt } from "express-jwt"
import { User } from "../models/user.schema.js"
import jwt from "jsonwebtoken"
import passport from "passport";
import dotenv from "dotenv"
import mongoose from "mongoose";
dotenv.config()

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization'); // Assuming the token is sent in the Authorization header
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }
  
    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      const userId = decodedToken._id;

      User.findById(userId)
        .then((user) => {
          if (!user) {
            return res.status(401).json({ message: 'User not found.' });
          }
          req.token = token.replace('Bearer ', '');
          req.profile = user;
          next();
        })
        .catch((error) => {
          res.status(500).json({ message: 'Server error.' });
        });
    });
  };

const verifyaccount = async (req, res) => {
  try {
      const user = await User.findOne({ verificationToken: req.params.token });

      if (!user) {
          return res.status(404).json({ success: false, error: 'Invalid or expired verification token' });
      }

      user.isVerified = true;
      user.verificationToken = '';
      await user.save();

      res.status(200).json({ success: true, message: `${user.name}, your email verified successfully` });
  } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

const loginSuccess = (req, res) => {
  if (req.profile) {
    res.json({
      success: true,
      message: "Successfully Logged In",
      token: req.token,
      user: req.profile,
    });
  } else {
    res.json({ success: false, message: "Not Authorized" });
  }
};

const loginFailed = (req, res) => {
  const message = req.query.message;
  if(message) {
    res.json({
      success: false,
      message: message,
    });
  } else {
    res.json({
      success: false,
      message: "Log in failure",
    });
  }
};

const google = passport.authenticate("google", ["profile", "email"]);
const callback = (req, res, next) => {
    passport.authenticate("google", (err, user) => {

      // checking how things work
      console.log(user);
      if (err) {
        return res.redirect(`${process.env.CLIENT_URL_CALLBACK}?error=gmailerror`);
        // return res.redirect(`/auth/google/failed?message=${err.message}`);
      }
      if (!user) {
        return res.redirect("/auth/google/failed");
      }
  
      const token = jwt.sign(
        {
          _id: user._id,
          admin: user.admin,
        },
        process.env.JWT_SECRET
      );
  
      res.cookie("t", token, {
        expire: new Date() + 9999,
      });
  
      // Attach the token and user profile to the req object
      req.token = token;
      req.profile = user;
     
      // Redirect to the appropriate client route after successful authentication
      return res.redirect(`${process.env.CLIENT_URL_CALLBACK}?token=${token}`);
    })(req, res, next);
  };
  

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error while logging out:", err);
      // Handle any errors that occurred during logout
      return res.status(500).json({ error: "Error while logging out" });
    }

    res.json({
      success: true,
      message: "User logged Out successfully.",
    });
  });
};



const signin = async (req, res) => {
    try {
        let user = await User.findOne({
            "email": req.body.email
        })
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found"
            })
          }
        if(user.googleID) {
          return res.status(401).send({
            success: false,
            error: "This email address uses Google Sign-in."
        })
        }

        if (!user.authenticate(req.body.password)) {
            return res.status(401).send({
                success: false,
                error: "Email or password don't match."
            })
        }

        const token = jwt.sign({
            _id: user._id,
            admin: user.admin,
            seller: user.seller
        }, process.env.JWT_SECRET)

        // console.log(process.env.JWT_SECRET);

        res.cookie("t", token, {
            expire: new Date() + 9999
        })

        return res.json({
            success: true,
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
    const userRequesting = await User.findById(id)
    const authorized = (req.profile && req.auth) && (JSON.stringify(req.profile._id) === JSON.stringify(req.auth._id));
    // if the user is an admin, they are authorized
    if (userRequesting.admin === true) {
        return next()
    }

    if (!authorized) {
        return res.status(403).json({
            success: false,
            error: "User is not authorized"
        })
    }
    return next()
}

const isAdmin =  async (req, res, next) => {
    
    try {
        let id = req.auth._id
        let user = await User.findById(id)
    
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
    isAdmin,
    google,
    loginSuccess,
    loginFailed,
    logout,
    callback,
    authenticateToken,
    verifyaccount
}