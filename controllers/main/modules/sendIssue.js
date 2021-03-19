const model=require("../../../models");
const jwt=require('jsonwebtoken');

module.exports=async function(req,res,issue,prev=false){
  const auth=req.headers['authorization'];
  const vote=await model.vote.findAll({
    attributes:[
      "vote",
      [model.sequelize.fn('COUNT','*'), 'count']
    ],
    where:{
      postId:issue.id,
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
        'postId':issue.id
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
  const send=function(voted){
    res.send({
      postId:issue.id,
      title:issue.title,
      voted:voted,
      agree:(prev||voted>0)
        ?vote.filter(x=>x.vote).reduce((acc,x)=>x.dataValues.count,0)
        :undefined,
      disgree:(prev||voted>0)
        ?vote.filter(x=>!x.vote).reduce((acc,x)=>x.dataValues.count,0)
        :undefined,
      comments:(prev||voted>0)
        ?comments.map(x=>{
          return {
            commentId:x["comment.id"],
            text:x["comment.content"],
            like:x.like,
            createdAt:x.createdAt||'null',
            agree:true
          }
        })
        :undefined
    });
  };
  if(auth===undefined){
    send(0);
    return;
  }
  jwt.verify(auth.split(' ')[1],'salt',async(err,data)=>{
    if(err){
      //invalid token
      res.status(404).send("Invalid token")
      return;
    }
    const userVoted=await model.vote.findAll({
      where:{
        postId:issueId,
        userId:data.id
      }
    })
    if(userVoted.length>0){
      send((userVoted.length>0)?userVoted[0].vote:0);
    }
    else{
      send(0);
    }
  });
  
}