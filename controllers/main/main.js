const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=async function(req,res,hotIssueId){
  const auth=req.headers['authorization'];
  const hotIssue=await model.post.findByPk(hotIssueId)
  const vote=await model.vote.findAll({
    attributes:[
      "vote",
      [model.sequelize.fn('COUNT','*'), 'count']
    ],
    where:{
      postId:hotIssueId,
    },
    group:'vote'  
  });
  const comments=await model.comment.findAll({
    where:{
      postId:hotIssueId
    },
    include:{
      model:model.user,
      attributes:['nickname']
    },
    raw:true
  });
  if(auth===undefined){
    res.send({
      hotIssue,
      voted:false,
      agree:vote.filter(x=>x.vote)[0].dataValues.count,
      disgree:vote.filter(x=>!x.vote)[0].dataValues.count,
      comments
    })
    return;
  }
  jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
    if(err){
      //invalid token
      res.status(404).send("Invalid token")
      return;
    }
    const userVoted=await model.vote.findAll({
      postId:hotIssueId,
      userId:data.id
    })
    const voted=(userVoted.length>0)?true:false;
    if(voted){
      res.send({
        ...hotIssue,
        voted,
        comments
      });
    }
    else{
      res.send({
        ...hotIssue,
        voted
      });
    }
  });
  //res.send("this is main");
}