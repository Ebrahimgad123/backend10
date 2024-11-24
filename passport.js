const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

// استراتيجية Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_ID,
    callbackURL: process.env.CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
      console.log(profile.photos);  // طباعة بيانات المستخدم في Google
    
      try {
        // محاولة إيجاد وتحديث أو إنشاء المستخدم في قاعدة البيانات
        let user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          },
          { new: true, upsert: true }  // تحديث البيانات أو إنشاء المستخدم
        );
        return done(null, user);  // إرسال المستخدم إلى الجلسة
      } catch (error) {
        console.error('Error in saving user:', error);
        return done(error, null);  // إرسال الخطأ إذا حدث
      }
  })
);

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
