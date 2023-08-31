import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import Profile from '../models/profile.schema.js';
import { User } from '../models/user.schema.js';
import errorHandler from '../helpers/dbhelper.js';
import Shop from '../models/shop.schema.js';
import Log from '../models/log.schema.js'
const defaultImage = '/public/files/default.png';

const updateProfile = async (req, res) => {
    const og = _.cloneDeep(req.profile);
    let form = formidable({ multiples: false })
    form.keepExtensions = true;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ success: false, error: 'Image could not be uploaded' });
        // console.log(req.profile._id, 'req.profile._id');
        let profile = await Profile.findOne({owner: req.profile._id}).exec().then((pro) => {
            return pro;
        }
        ).catch((err) => {
            return res.status(400).json({ success: false,error: 'Could not find profile'});
        });

        const updates = {
            name: fields.name ? fields.name.join(' ') : profile.name,
            bio: fields.bio ? fields.bio.join(' ') : profile.bio,
            location: fields.location ? fields.location.join(' ') : profile.location,
        }

        profile = _.extend(profile, updates);
        // console.log(fields, 'fields');
        
        if (files.image) {  
            profile.image.data = fs.readFileSync(files.image[0].filepath)
            profile.image.contentType = files.image[0].mimetype
        }

        try {
            await profile.save();
            res.json(profile);
            const updatedFields = [];
            const changedValues = {};
            const productKeys = Object.keys(profile._doc);
      
            for (const key of productKeys) {
              if (
                key === "_id" ||
                key === "createdAt" ||
                key === "updatedAt" ||
                key === "owner" ||
                key === "email" ||
                key === "followers" ||
                key === "followig"
              ) {
                continue;
              }
      
              if (Array.isArray(profile._doc[key])) {
                if (!arraysEqual(og._doc[key], profile._doc[key])) {
                  updatedFields.push(key);
                  changedValues[key] = { old: og._doc[key], new: profile._doc[key] };
                }
              } else if (og._doc[key] !== profile._doc[key]) {
                updatedFields.push(key);
                changedValues[key] = { old: og._doc[key], new: profile._doc[key] };
              }
            }
      
            const updatedFieldsString = updatedFields.join(", ");
      
            function arraysEqual(a, b) {
              if (a === b) return true;
              if (a == null || b == null) return false;
              if (a.length !== b.length) return false;
      
              for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
              }
      
              return true;
            }
      
            if (changedValues !== {}) {
              
              const log = new Log({
                user: req.profile._id,
                resource: "user",
                resourceid: profile._id,
                action: "profileupdate",
                description: `${updatedFieldsString} was updated`,
                details: changedValues,
              });
      
              await log.save();
            }
        } catch (error) {
            return res.status(400).json({ success: false,
                error: errorHandler.getErrorMessage(error)
            });
        }
    });
}

const profileByID = async (req, res, next, id) => {
    try {
        let profile = await Profile.findById(id).populate('following', '_id name').populate('followers', '_id name').exec();
        if (!profile) return res.status(400).json({ success: false, error: "Profile not found" });
        req.user_profile = profile;
        next();
    } catch (error) {
        return res.status(400).json({ success: false, error: "Could not retrieve profile" });
    }
}

const addFollowing = async (req, res, next) => {
    try {
        const userProfile = await Profile.findOne({ owner: req.body.followerId });
        await Profile.findByIdAndUpdate(userProfile._id, {
            $push: { following: req.body.theFollowedId }
        }).populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();

            next()

            var followed = await User.findById(req.body.theFollowedId)
            const log = new Log({
                user: req.body.followerId,
                resource: "user",
                action: "addfollow",
                resourceid: req.body.theFollowedId,
                description: `${userProfile.name} start following ${followed.name}`,
                details: followed
            })
            await log.save();
    } catch (error) {
        return res.status(400).json({ success: false, error: errorHandler.getErrorMessage(error) });
    }
}

const addFollower = async (req, res) => {
    try {
        const userProfile = await Profile.findOne({owner: req.body.theFollowedId});
        // console.log(userProfile, 'yeeeaaaa', req.body.theFollowedId);
        const updatedProfile = await Profile.findByIdAndUpdate(userProfile._id, {
            $push: { followers: req.body.followerId}
        }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();

        res.json(updatedProfile);
    } catch (error) {
        return res.status(400).json({ success: false, error: errorHandler.getErrorMessage(error) });
    }
}

const removeFollowing = async (req, res, next) => {
    try {
        const userProfile = Profile.findOne({owner : req.body.removerId});
        await Profile.findByIdAndUpdate(userProfile._id, {
            $pull: { following: req.body.theRemovedId }
        }).populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();
        
        next();

        var removed = await User.findById(req.body.theRemovedId)
        const log = new Log({
            user: req.body.removerId,
            resource: "user",
            action: "removefollow",
            resourceid: req.body.theFollowedId,
            description: `${userProfile.name} unfollow ${removed.name}`,
            details: removed
        })
        await log.save();
    } catch (error) {
        return res.status(400).json({ success: false, error: errorHandler.getErrorMessage(error) });
    }
}

const removeFollower = async (req, res) => {
    try {
        const userProfile = Profile.findOne({owner : req.body.theRemovedId});
        const updatedProfile = await Profile.findByIdAndUpdate(userProfile._id, {
            $pull: { followers: req.body.removerId }
        }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();

        res.json(updatedProfile);
    } catch (error) {
        return res.status(400).json({ success: false, error: errorHandler.getErrorMessage(error) });
    }
}

const profileByUserId = async (req, res) => {
    try {
        let id = req.profile._id;
        let profile = await Profile.findOne({owner: id});
        if (!profile) return res.status(400).json({ success: false, error: "Profile not found" });
        req.user_profile = profile;

        return res.json({ success: true, profile: profile });
    } catch (error) {
        return res.status(400).json({ success: false, error: "Could not retrieve profile" });
    }
}

const read = async (req, res) => {
    req.user_profile.image = undefined;
    return res.json(req.user_profile);
}

const remove = async (req, res) => {
    try {
        let profile = req.user_profile;
        let deletedProfile = await profile.remove();
        res.json(deletedProfile);
        const log = new Log({
            user: deletedProfile.owner,
            resource: "user",
            resourceid: deletedProfile._id,
            action: "profileremove",
            description: `${deletedProfile.name} profile has been removed!`,
            details: deletedProfile
        })
        await log.save();
    } catch (error) {
        return res.status(400).json({ success: false, error: errorHandler.getErrorMessage(error) });
    }
}

const photo = (req, res, next) => {
    if (req.user_profile.image.data) {
        res.set("Content-Type", req.user_profile.image.contentType);
        return res.send(req.user_profile.image.data);
    }
    next();
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultImage);
}

const list = async (req, res) => {
    try {
        let profiles = await Profile.find().select('name email updated created');
        res.json(profiles);
    } catch (error) {
        return res.status(400).json({ success: false, error: errorHandler.getErrorMessage(error) });
    }
}

const isOwner = async (req, res, next) => {
    const isOwner = req.profile && req.auth && req.profile._id == req.auth._id;
    const isAdmin = await User.findById(req.auth._id).then(user => {
        return user.admin;
    })

    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, error: "User is not authorized" });
    next();
}


export default { list, defaultPhoto, profileByID, profileByUserId, remove, addFollower, addFollowing, photo, isOwner, updateProfile, read, removeFollower, removeFollowing };