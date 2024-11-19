// استيراد المكتبات الضرورية
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config(); // تحميل المتغيرات البيئية من ملف .env
const dbConfig = require("./config/db"); // إعداد قاعدة البيانات
const { logger } = require("./middlewares/logger"); // استيراد المسجل
const { notFound, errorHandling } = require("./middlewares/errorHandler");
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('./passport'); // إعداد المصادقة عبر Passport
const { createServer } = require('node:http'); // استيراد HTTP server
const app = express();

// إعداد المنفذ
const port = process.env.PORT || 8000; 
const server = createServer(app); // إنشاء خادم HTTP

app.set("view engine", "ejs");

// Middleware للإعدادات المختلفة
app.use(express.json()); // تحليل JSON
app.use(express.urlencoded({ extended: false })); // تحليل البيانات المشفرة
app.use(compression()); // ضغط الاستجابات
app.use(helmet()); // إضافة أمان بواسطة Helmet

app.use(cookieParser());

// إعداد الجلسات مع Passport
const MongoStore = require('connect-mongo');
app.use(session({
  secret: process.env.SESSION_SECRET || 'Secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }, // تأكد من أنك في بيئة آمنة
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// إعداد CORS للسماح بالطلبات من الواجهة الأمامية
app.use(cors({
  origin: 'https://tour-relax.vercel.app',
  credentials: true
}));

// إعداد Passport
app.use(passport.initialize());
app.use(passport.session());

// تقديم الملفات الثابتة
app.use(express.static('public'));
app.use("/images", express.static(path.join(__dirname, "images")));

// إعداد المسجل لتسجيل النشاطات
app.use(logger);

// إعداد مسارات التطبيق
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // إرسال ملف HTML عند الوصول إلى الجذر
});

app.get("/", (req, res) => {
  res.send(`<h2 style="color:green;text-align:center">Welcome To Our Api App</h2>
            <h2 style="color:green;text-align:center">I will show you How To use it</h2>`);
});

// ربط المسارات الخاصة بالمصادقة والملفات الأخرى
app.use("/api", require("./routes/authRoute"));
app.use("/api", require("./routes/profileRoute"));
app.use('/api', require("./routes/rideRoutes"));
app.use('/api', require("./routes/citiesRoute"));

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

//   })
  
// });


