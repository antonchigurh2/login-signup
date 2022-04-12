//jshint esversion:8
const router=require('express').Router();
const verify=require('./verifyTOKEN');
router.get('/',verify,(req,res)=>{
  res.json({posts:{title:'my first post',description:"data you shouldnt access"}});
});
module.exports=router;
