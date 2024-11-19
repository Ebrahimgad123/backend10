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
require('./passport');
// const { Server } = require('socket.io'); // استيراد Socket.io
const { createServer } = require('node:http'); // استيراد HTTP server
const app = express();


const port = process.env.PORT || 8000; // تعيين المنفذ
const server = createServer(app); // إنشاء خادم HTTP
// const io = new Server(server); // إعداد Socket.io

app.set("view engine", "ejs");

app.use(express.json()); // تحليل JSON
app.use(express.urlencoded({ extended: false })); // تحليل البيانات المشفرة
app.use(compression()); // ضغط الاستجابات
app.use(helmet({ contentSecurityPolicy: false })); // إعداد Helmet، وتعطيل سياسة CSP

app.use(cookieParser());
// auth google
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));


app.use(cors({
  origin: 'https://tour-relax.vercel.app',
  credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

//
// app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

app.use("/images", express.static(path.join(__dirname, "images")));


app.use(logger);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // إرسال ملف HTML
});

app.get("/",(req,res)=>{
  res.send(`<h2 style="color:green;text-align:center">Welcome To Our Api App</h2>
            <h2 style="color:green;text-align:center">I will show you How To use it</h2>
    `)
})
app.use("/api", require("./routes/authRoute"));
app.use("/api", require("./routes/profileRoute"));
app.use('/api',require("./routes/rideRoutes"));
app.use('/api',require("./routes/citiesRoute"));


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


