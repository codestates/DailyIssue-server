const model=require("../../models");
const jwt=require('jsonwebtoken');
const sendIssue = require("./modules/sendIssue");

module.exports={
  async getById(req,res){
    const auth=req.headers['authorization'];
    const smallIssue=await model.post.findByPk(req.params.id);
    if(smallIssue===null || Object.keys(smallIssue).length===0){
      res.status(404).send("No Such Small Issue");
      return;
    }
    sendIssue(res,smalIssue,auth);
  },
  async get(req,res,next){
    const auth=req.headers['authorization'];
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
    sendIssue(res,smallIssue,auth);
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
      await model.post.create({userId:data.id,title:req.body.title,createdAt:new Date()});
      res.send("success!");
    });
  }
}