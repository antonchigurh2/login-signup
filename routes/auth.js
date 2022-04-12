//jshint esversion:8
const router=require("express").Router();
const User=require("../model/User");
const{registerValidation,loginValidation} =require('../validation');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
router.get("/register",function(req,res){
  res.sendFile(__dirname+"/register.html");
});
router.post('/register',async (req,res)=>{
//validate data before registering a user
 const{error}=registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  //if user already registered
  const emailExist=await User.findOne({email:req.body.email});
  if(emailExist) return res.status(400).send('There is already an account registered with this email address');
  //Hash passwords
  const salt=await bcrypt.genSalt(10);
  const hashedPassword=await bcrypt.hash(req.body.password,salt);
  const user=new User({
    name:req.body.name,
    email:req.body.email,
    password:hashedPassword
  });
  try{
    const savedUser=await user.save();
    res.send({user:user._id});
  }catch(err){
    res.status(400).send(err);
  }
});
router.post('/login',async (req,res)=>{
  //validate data before logging in a user
  const{error}=loginValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);
   //if user already registered
   const user=await User.findOne({email:req.body.email});
   if(!user) return res.status(400).send('Account not find,please sign up first to create an account or check credentials');
   //password is correct
   const validPass=await bcrypt.compare(req.body.password,user.password);
   if(!validPass) return res.status(400).send('Invalid Password');
   // create and assign a token
   const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
   res.header("auth-token",token).send(token);
   // res.send('logged in');
});
module.exports=router;
