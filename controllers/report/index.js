const model=require("../../models");
const jwt=require('jsonwebtoken');
const comment = require("../main/comment");

module.exports={
  async issue(req,res){    
    const auth=req.headers['authorization'];
    if(auth===undefined){
      res.status(400).send('Not authorized');
      return;
    }
    jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
      if(err){
        res.status(400).send('Invalid authorization');
      }
      await model.postReport.create({reportBy:data.id,postId:req.body.postId,text:req.body.title,createdAt:new Date()});
      res.send("success!");
    });
  },
  async comment(req,res){
    const auth=req.headers['authorization'];
    if(auth===undefined){
      res.status(400).send('Not authorized');
      return;
    }
    jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
      if(err){
        res.status(400).send('Invalid authorization');
      }
      await model.commentReport.create({reportBy:data.id,commentId:req.body.commentId,text:req.body.text,createdAt:new Date()});
      res.send("success!");
    });
  }
}