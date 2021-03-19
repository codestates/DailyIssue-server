const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=async function(req,res){
  const dailyIssueId=1;
  const auth=req.headers['authorization'];
  const dailyIssue=await model.post.findByPk(dailyIssueId)
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
  if(auth===undefined){
    res.send({
      postId:dailyIssue.id,
      title:dailyIssue.title,
      voted:false
    })
    return;
  }
  jwt.verify(auth.split(' ')[1],'salt',async(err,data)=>{
    if(err){
      //invalid token
      res.status(404).send({data:err,message:"Invalid token"});
      return;
    }
    const userVoted=await model.vote.findAll({
      where:{
        postId:dailyIssueId,
        userId:data.id
      }
    })
    const voted=(userVoted.length>0)?true:false;
    if(voted){
      res.send({
        postId:dailyIssue.id,
        title:dailyIssue.title,
        voted:false,
        agree:vote.filter(x=>x.vote).reduce((acc,x)=>x.dataValues.count,0),
        disgree:vote.filter(x=>!x.vote).reduce((acc,x)=>x.dataValues.count,0),
        comments:comments.map(x=>{
          return {
            commentId:x["comment.id"],
            text:x["comment.content"],
            like:x.like,
            createdAt:x.createdAt||'null',
            agree:true
          }
        })
      });
    }
    else{
      res.send({
        postId:dailyIssue.id,
        title:dailyIssue.title,
        voted:false,
      });
    }
  });
  //res.send("this is main");
}