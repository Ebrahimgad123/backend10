const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET_ID,
  callbackURL: process.env.CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {  // Use lowercase 'profile'
  console.log('Google Profile:', profile);  // Debugging: Log the profile to inspect its structure

  // Check if profile is valid and contains necessary information
  if (!profile || !profile.displayName || !profile.emails || !profile.photos) {
    console.error('Error: Profile data is incomplete', profile);  // Log profile if missing data
    return done(new Error('Profile data is incomplete'), null);
  }

  try {
    // Update or create user in the database
    let user = await User.findOneAndUpdate(
      { googleId: profile.id },
      {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        firstName: profile.givenName,  // Add first name
        lastName: profile.familyName,  // Add last name
        emailStatus: profile.emails[0].verified ? 'Verified' : 'Unverified',  // Update email status
      },
      { new: true, upsert: true }  // Update or insert a new user
    );
    
    done(null, user);
  } catch (error) {
    console.error('Error in saving user:', error);
    done(error, null);
  }
}));

// Serialize user data to store in session (only store user ID to reduce session size)
passport.serializeUser((user, done) => {
  done(null, user.id);  // Store user ID in session
});

// Deserialize user based on user ID from session (fetch full user data from DB)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Retrieve full user details
    done(null, user);  // Send back full user data
  } catch (error) {
    console.error('Error in deserializing user:', error);
    done(error, null);  // Return error if something goes wrong
  }
});
