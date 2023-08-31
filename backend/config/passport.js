import passport from "passport"
import Google from "passport-google-oauth20";
import { User, GoogleUser } from "../models/user.schema.js";
import Profile from "../models/profile.schema.js";
const GoogleStrategy = Google.Strategy; 

passport.use(
    new GoogleStrategy(
      {
        clientID:
          process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async function (accessToken, refreshToken, profile, callback) {
        let user = await User.findOne({
          email: profile._json.email,
        });
          // if we have user already registred 
        if(user) {
          if(!user.googleID) { // if he is registred with email and pass
            return callback(
              new Error(
                'gmailerror'
              )
            );
          } else { // if he is already registed with google
            callback(null, user);
          }
        } else if (!user) { // if never registred, first time
            user = new GoogleUser({
                name: profile.displayName,
                email: profile._json.email,
                googleID: profile.id,
                gmaildata: profile
              });
              await user.save()

              callback(null, user);
              
              const userprofile = new Profile({
                name: user.name,
                email: user.email,
                owner: user._id,
                following: [],
                followers: [],
                location: '',
                bio: '',
                image: { data: '', contentType: ''}
            })
            
            await userprofile.save()
        } 

      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  export default passport;