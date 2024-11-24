const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

// استراتيجية Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET_ID,
  callbackURL: process.env.CALLBACK_URL,
  scope: ['profile', 'email']  // تأكد من أنك تطلب الوصول إلى البيانات المطلوبة
}, async (accessToken, refreshToken, profile, done) => {
  console.log(profile); // تحقق من محتويات profile
  if (!profile || !profile.displayName || !profile.emails || !profile.photos) {
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
      },
      { new: true, upsert: true } 
    );
    done(null, user);
  } catch (error) {
    console.error('Error in saving user:', error);
    done(error, null);
  }
}));


// تخزين بيانات المستخدم في الجلسة
passport.serializeUser((user, done) => {
  done(null, user.id);  // نقوم بتخزين الـ ID فقط لتقليل الحجم
});

// استرجاع بيانات المستخدم من الجلسة بناءً على الـ ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // استرجاع المستخدم من قاعدة البيانات
    done(null, user);  // إرسال بيانات المستخدم بعد استرجاعها
  } catch (error) {
    done(error, null);  // إرسال الخطأ إذا حدث
  }
});
