import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import Profile from '../models/profile.schema.js';
import User from '../models/user.shema.js';
import errorHandler from '../helpers/dbhelper.js';

const defaultImage = '/public/files/default.png';

const updateProfile = async (req, res) => {
    let form = formidable({ multiples: false })
    form.keepExtensions = true;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ success: false, error: 'Image could not be uploaded' });
        let profile = await Profile.findOne({owner: req.profile._id}).exec().then((profile) => {
            return profile;
        }
        ).catch((err) => {
            return res.status(400).json({ success: false,error: 'Could not find profile'});
        });

        const updates = {
            name: fields.name.join(' '),
            bio: fields.bio.join(' '),
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
        return res.json(profile);
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