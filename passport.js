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


passport.serializeUser((user, done) => {
  console.log("=============User=====================", user._id.toString());
  done(null, user._id.toString()); 
});


passport.deserializeUser(async (id, done) => {
  try {
    // استرداد بيانات المستخدم من قاعدة البيانات باستخدام المعرف
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"), null); // في حال عدم وجود المستخدم
    }
    done(null, user); // إرجاع بيانات المستخدم
  } catch (error) {
    console.error("Error in deserializing user:", error);
    done(error, null); // إرجاع الخطأ
  }
});
