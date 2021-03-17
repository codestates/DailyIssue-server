const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=async function(req,res,next){
  console.log(req.params.date);
  let hotIssue, hotIssueId;
  if(req.params.date.match(/dddd-dd-dd/)){ //날짜인지확인하는부분 자세하게구현할필요있음
    hotIssue=await model.post.findOne({
      where:{
        createdAt:req.parms.date
      }
    });
  }
  if(hotIssue){
    hotIssueId=hotIssue.postId;
  }
  else{
    hotIssueId=1;
    hotIssue=await model.post.findByPk(1);
  }
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
  res.send({
    hotIssue,
    voted:false,
    agree:vote.filter(x=>x.vote)[0].dataValues.count,
    disgree:vote.filter(x=>!x.vote)[0].dataValues.count,
    comments
  });
}