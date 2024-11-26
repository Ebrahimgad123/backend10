const express = require("express");  //✔
const cors = require("cors");       //✔
const compression = require("compression"); 
const path = require("path");   
const helmet = require("helmet");
require("dotenv").config(); 
const dbConfig = require("./config/db"); 
const { logger } = require("./middlewares/logger"); 
const { notFound, errorHandling } = require("./middlewares/errorHandler");
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieSession=require('cookie-session')
const cookieParser = require('cookie-parser');
require('./passport'); 
const { createServer } = require('node:http'); // استيراد HTTP server
const app = express();
app.use(cookieParser());


app.use((req, res, next) => {
  console.log('Cookies:', req.cookies);  
  next();
});

// بقية الميدل وير الخاص بك
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// إعداد المنفذ
const port = process.env.PORT || 8000; 
const server = createServer(app); 

app.set("view engine", "ejs");


app.use(compression()); 
app.use(helmet()); 




const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET || 'sessionSecret2345678765467',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI ,
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, 
  },
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
  origin: ['https://tour-relax.vercel.app', 'http://localhost:3000','https://linguistic-josephine-nooragniztion-eccb8a70.koyeb.app'],
  credentials: true
}));




app.use(express.static('public'));
app.use("/images", express.static(path.join(__dirname, "images")));


app.use(logger);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});

app.get("/", (req, res) => {
  res.send(`<h2 style="color:green;text-align:center">Welcome To Our Api App</h2>
            <h2 style="color:green;text-align:center">I will show you How To use it</h2>`);
});
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.clearCookie('connect.sid'); 
    res.redirect('/'); 
  });
});

app.use("/api", require("./routes/authRoute"));
// app.use("/api", require("./routes/profileRoute"));
// app.use('/api', require("./routes/rideRoutes"));
app.use('/api', require("./routes/citiesRoute"));


app.use(notFound);
app.use(errorHandling);



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


