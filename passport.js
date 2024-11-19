const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_ID,
    callbackURL: process.env.CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
      console.log(profile.photos); 
    
      try {
        let user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          },
          { new: true, upsert: true } 
        );
        done(null, user);
        console.log('User in session:', req.user);
      } catch (error) {
        console.error('Error in saving user:', error);
        done(error, null); 
      }
  }));
  

  passport.serializeUser((user, done) => {
    console.log('User in session:', req.user);
    done(null, user.id); 
});
  
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id); 
    console.log('User in session:', req.user);
    done(null, user);
});
