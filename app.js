// استيراد المكتبات الضرورية
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config(); // تحميل المتغيرات البيئية من ملف .env
const dbConfig = require("./config/db"); // إعداد قاعدة البيانات
const { logger } = require("./middlewares/logger"); // استيراد المسجل
const { notFound, errorHandling } = require("./middlewares/errorHandler"); // استيراد معالجات الأخطاء
// const { Server } = require('socket.io'); // استيراد Socket.io
const { createServer } = require('node:http'); // استيراد HTTP server
const app = express();
//////////////////
// auth google
///////////////////
const passport = require('passport');
const session = require('express-session');
const User = require('./models/User');
// إعداد الجلسة
app.use(session({
  secret: process.env.SECRET_SESSION, // يفضل استخدام متغير البيئة هنا
  resave: false,
  saveUninitialized: true,
}));

// إعداد CORS
const allowedOrigins = ['http://localhost:3000','http://localhost:3000/login', 'http://localhost:8000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// إعداد Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
require('./passport');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
///////////////////////////////
// إعداد التطبيق باستخدام Express

const port = process.env.PORT || 8000; // تعيين المنفذ
const server = createServer(app); // إنشاء خادم HTTP
// const io = new Server(server); // إعداد Socket.io

// إعداد محرك العرض
app.set("view engine", "ejs");
// إعداد الوسطاء (middlewares)
app.use(express.json()); // تحليل JSON
app.use(express.urlencoded({ extended: false })); // تحليل البيانات المشفرة
app.use(compression()); // ضغط الاستجابات
app.use(helmet({ contentSecurityPolicy: false })); // إعداد Helmet، وتعطيل سياسة CSP

// // تقديم ملفات Socket.io
// app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

// تقديم ملفات الصور
app.use("/images", express.static(path.join(__dirname, "images")));

// استخدام المسجل
app.use(logger);

/////////////////////////////////////
// // إضافة المسارات الخاصة بـ API
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); // إرسال ملف HTML
// });

// إعداد المسارات الخاصة بالـ API
app.get("/",(req,res)=>{
  res.send(`<h2 style="color:green;text-align:center">Welcome To Our Api App</h2>
            <h2 style="color:green;text-align:center">I will show you How To use it</h2>
    `)
})
app.use("/api", require("./routes/authRoute"));
app.use("/api", require("./routes/profileRoute"));
app.use('/api',require("./routes/rideRoutes"));
app.use('/api',require("./routes/paymentRoute"));


// التعامل مع الأخطاء
app.use(notFound);
app.use(errorHandling);

// بدء الخادم
server.listen(port, () => {
  console.log(`Server is listening on port ${port} in ${process.env.NODE_ENV} mode`);
});

// // إعداد Socket.io
// io.on('connection', (socket) => {
//   socket.on('chat message', (msg) => {
//     io.emit('chat message', msg);
//     // socket.broadcast.emit('chat message',msg)
//   });
//   socket.on('typing',(msg)=>{
//     socket.broadcast.emit('show_typing_status')
//   })
//   socket.on('not_typing',(msg)=>{
//     setTimeout(() => {
//       socket.broadcast.emit('show_not_typing_status')
//     }, 3000);
//   })
  
// });

