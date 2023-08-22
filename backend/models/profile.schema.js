import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
    },  
    bio: {
        type: String,
        trim: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    location: {
        type: String,
        trim: true,
    },
    owner: {type: mongoose.Schema.ObjectId, ref: 'User'},
    following: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}],
    followers: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}],
}
, {timestamps: true}
);

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;