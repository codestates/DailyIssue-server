const model=require("../../../models");
const jwt=require('jsonwebtoken');
const getVoteNComments = require("./getVoteNComments");

module.exports=async function(req,res,issue,prev=false){
  const auth=req.headers['authorization'];
  let vote,comments;
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
            agree:x['comment.user.votes.vote']?true:false
          }
        })
        :undefined
    });
  }; 

  if(prev){
    const tmp=getVoteNComments(issue);
    vote=await tmp.vote;
    comments=await tmp.comments;
  }
  if(auth===undefined){
    send(0);
    return;
  }
  jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
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
      if(!prev){
        const tmp=getVoteNComments(issue);
        vote=tmp.vote;
        comments=tmp.comments;
      }
      send(userVoted[0].vote);
    }
    else{
      send(0);
    }
  });
  
}