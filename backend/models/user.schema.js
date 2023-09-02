import mongoose from "mongoose";
import crypto from "crypto";

/*
    web sockets 
    oauth 2
    using docker and trying to deploy it ig
*/

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      unique: "Email already exists",
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      required: "Email is required",
    },
    hashed_password: {
      type: String,
      required: function () {
        // Require the hashed password if the googleID is not set
        return !this.googleID;
      },
    },
    verificationToken: {
      type: String,
      default: ''
  },
  isVerified: {
      type: Boolean,
      default: false
  },
    googleID: String,
    salt: String,
    admin: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.virtual("password")
  .set(function (password) {
    // create a temporary variable called _password
    // console.log('setting password', password);
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encryptPassword
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      // console.log('encrypting password', password);
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      // console.log('error encrypting password', error);
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

UserSchema.path("hashed_password").validate(function (v) {
  // console.log('here', this._password, this.password);

  if (!this.googleID) {
    if (this._password && this._password.length < 8) {
      this.invalidate("password", "Password must be at least 8 characters.");
    }
    if (this.isNew && !this.password) {
      this.invalidate("password", "Password is required");
    }
    if (this._password && !/[A-Z]/.test(this._password)) {
      this.invalidate(
        "password",
        "Password must contain at least one uppercase letter."
      );
    }
    if (this._password && !/[a-z]/.test(this._password)) {
      this.invalidate(
        "password",
        "Password must contain at least one lowercase letter."
      );
    }
    if (this._password && !/\d/.test(this._password)) {
      this.invalidate("password", "Password must contain at least one number.");
    }
    if (this._password && !/[!@#$%^&*]/.test(this._password)) {
      this.invalidate(
        "password",
        "Password must contain at least one special character (!@#$%^&*)."
      );
    }
  }

  // console.log('validation passed');
}, null);

const User = mongoose.model("User", UserSchema);

const googleUserSchema = new mongoose.Schema({
  gmaildata: Object,
  // Add any additional fields specific to Google users here, if needed
});

// Set up the discriminator for Google users
const GoogleUser = User.discriminator("GoogleUser", googleUserSchema);

export { User, GoogleUser };
