if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const flash=require("connect-flash");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const passport=require("passport");
const LocalStrtegy=require("passport-local");
const User=require("./models/user.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
const dbUrl=process.env.ATLASDB_URL;
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error in mongo session store");
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrtegy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});
app.use((req, res, next) => {
  res.locals.MAPS_API_KEY = process.env.MAPS_API_KEY;
  next();
});

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    await mongoose.connect(dbUrl);
}                        
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
    
});


app.use((err,req,res,next)=>{
   //next(new ExpressError(404,"Some thing Went wrong"));
   let {statusCode=500,message}=err;
  res.status(statusCode).render("Error.ejs",{message});
});
app.listen(8080,()=>{
    console.log("SErver started");
});
