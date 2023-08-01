import passport from "passport"
import Google from "passport-google-oauth20";
import { User, GoogleUser } from "../models/user.schema.js";

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
        if (!user) {
            user = new GoogleUser({
                name: profile.displayName,
                email: profile._json.email,
                googleID: profile.id,
                gmaildata: profile
              });
              await user.save()
        }

        callback(null, user);
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