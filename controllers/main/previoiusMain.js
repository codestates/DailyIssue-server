const model=require("../../models");

module.exports=async function(req,res){
  console.log("prevMain");
  let dailyIssue, dailyIssueId;
  if(req.params.date.match(/dddd-dd-dd/)){ //날짜인지확인하는부분 자세하게구현할필요있음
    dailyIssue=await model.post.findOne({
      where:{
        createdAt:req.parms.date
      }
    });
  }
  if(dailyIssue){
    dailyIssueId=dailyIssue.postId;
  }
  else{
    dailyIssueId=1;
    dailyIssue=await model.post.findByPk(1);
  }
  const vote=await model.vote.findAll({
    attributes:[
      "vote",
      [model.sequelize.fn('COUNT','*'), 'count']
    ],
    where:{
      postId:dailyIssueId,
    },
    group:'vote'  
  });
  const comments=await model.like.findAll({
    attributes:[
      [model.sequelize.fn('COUNT','*'), 'like']
    ],
    include:[{
      right:true,
      require:false,
      model:model.comment,
      attributes:['id','content','createdAt'],
      where:{
        'postId':dailyIssueId
      },
      include:[{
        model:model.user,
        attributes:['nickname'],
        require:false
      }],
    }],
    raw:true,
    group:'commentId',
  });
  res.send({
    dailyIssue,
    voted:false,
    agree:vote.filter(x=>x.vote).reduce((acc,x)=>x.dataValues.count,0),
    disgree:vote.filter(x=>!x.vote).reduce((acc,x)=>x.dataValues.count,0),
    comments
  });
}