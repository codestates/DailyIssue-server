const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=function(req,res,next){
  const auth=req.headers['authorization'];
  if(auth===undefined){
    res.status(400).send('Not authorized');
    return;
  }
  jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
    if(err){
      res.status(400).send('Invalid authorization');
    }
    await model.like.create({userId:data.id,commentId:req.body.commentId,createdAt:new Date()});
    res.send("success!");
  });
};