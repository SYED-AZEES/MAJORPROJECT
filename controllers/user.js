const User=require("../models/user.js");
const ExpressError=require("../utils/ExpressError.js");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
       try{
        let{username,email,password}=req.body;
        const newUser= new User({email:email,username:username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to MYTRAVELS");
            res.redirect("/listings");
        })
       }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
       }
};
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to MYTRAVELS!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
          return   next(err);
        }
        req.flash("succes","You loged out successfully");
        res.redirect("/listings");
    });
};
