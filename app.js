 if(process.env.NODE_ENV !== "production"){
 require('dotenv').config();
}


const express = require('express');
const path=require('path');
const mongoose= require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const expressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const {campgroundSchema,reviewSchema} = require('./schemas.js');
const campgrounds=require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const passportLocal = require('passport-local');
const passport = require('passport');
const User = require('./models/user');
const userRoute = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL;
const MongoStore = require('connect-mongo');

// try{
// //mongoose.connect("mongodb+srv://sravan:<@cluster0.kz0elif.mongodb.net/?retryWrites=true&w=majority")
// // .then(()=>console.log("connection is established"))
// }catch(error){n
// console.log("error":error)
// }
//'mongodb://localhost:27017/yelp-camp',
mongoose.connect(dbUrl,{
    useNewUrlParser : true,
   // useCreateIndex : true,
    useUnifiedTopology : true
});

const db=mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database Connected");
});

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

app.use(session({
  secret:'thisisasecret',
   store: MongoStore.create({
mongoUrl:dbUrl,
touchAfter: 24* 60 *60
   })
}));

const sessionConfig ={
  name:'session',
  secret:'thisisasecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly : true,
    //secure:true,
    expires:Date.now() + 1000 *60 * 60 *24 * 7,
    maxAge : 1000 *60 * 60 *24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
});

app.use('/',userRoute);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get('/',(req,res) =>{
   res.render('home')
})


app.all("*",(req,res,next)=>{
  next(new expressError("Page Not Found!",404))
})

app.use((err,req,res,next)=>{
  const {statusCode=500,message="Something went wrong!"}= err;
  if(!err.message) err.message ='Something went wrong!'
res.status(statusCode).render('campgrounds/error',{err});
})

app.listen(3000,()=>{
    console.log('Serving on port 3000');
})