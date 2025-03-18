const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET_ID,
  callbackURL: process.env.CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => { 
  console.log('Google Profile:', profile);  

  if (!profile || !profile.displayName || !profile.emails || !profile.photos) {
    console.error('Error: Profile data is incomplete', profile);  
    return done(new Error('Profile data is incomplete'), null);
  }

  try {
    let user = await User.findOneAndUpdate(
      { googleId: profile.id },
      {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        firstName: profile.givenName,  
        lastName: profile.familyName,  
        emailStatus: profile.emails[0].verified ? 'Verified' : 'Unverified',  
      },
      { new: true, upsert: true }
    );
    done(null, user);
  } catch (error) {
    console.error('Error in saving user:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  console.log("=============User=====================", user._id.toString());
  done(null, user._id.toString()); 
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"), null); 
    }
    done(null, user); 
  } catch (error) {
    console.error("Error in deserializing user:", error);
    done(error, null); 
  }
});
