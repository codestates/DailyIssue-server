const model=require("../../models");
const jwt=require('jsonwebtoken');
const sendIssue = require("./modules/sendIssue");

module.exports={
  async getById(req,res){
    const smallIssue=await model.post.findByPk(req.params.id);
    if(smallIssue===null || Object.keys(smallIssue).length===0){
      res.status(404).send("No Such Small Issue");
      return;
    }
    sendIssue(req,res,smallIssue);
  },
  async get(req,res){
    const smallIssues=await model.post.findAll({
      where:{
        "userId":{
          [model.Sequelize.Op.ne]:1
        }
      }
    })
    if(smallIssues.length===0){
      res.status(404).send("No Small Issue");
      return;
    }
    const smallIssue=smallIssues[Math.floor(Math.random()*(smallIssues.length))];
    sendIssue(req,res,smallIssue);
  },
  post(req,res,next){
    const auth=req.headers['authorization'];
    if(auth===undefined){
      res.send(400).send('Not authorized');
      return;
    }
    jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
      if(err){
        res.send(400).send('Invalid authorization');
      }
      const newIssue=await model.post.create({userId:data.id,title:req.body.title,createdAt:new Date()});
      sendIssue(req,res,newIssue);
    });
  }
}