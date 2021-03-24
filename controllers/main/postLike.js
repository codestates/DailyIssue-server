const model=require("../../models");
const jwt=require('jsonwebtoken');
const getVoteNComments = require("./modules/getVoteNComments");

module.exports=function(req,res,next){
  const auth=req.headers['authorization'];
  const postId=req.body.postId;
  if(auth===undefined){
    res.status(400).send('Not authorized');
    return;
  }
  jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
    if(err){
      res.status(400).send('Invalid authorization');
    }
    await model.like.findOrCreate({
      where:{
        userId:data.id,
        commentId:req.body.commentId
      }
    });
    const userVoted=await model.vote.findOne({
      where:{
        postId:postId,
        userId:data.id
      }
    });
    const tmp=getVoteNComments(postId);
    const vote=await tmp.vote;
    const comments=await tmp.comments;
    res.send({
      voted:(userVoted.vote!==undefined),
      agree:vote.filter(x=>x.vote).reduce((acc,x)=>x.dataValues.count,0),
      disagree:vote.filter(x=>!x.vote).reduce((acc,x)=>x.dataValues.count,0),
      comments:comments.map(x=>{
        return {
          commentId:x["comment.id"],
          text:x["comment.content"],
          like:x.like,
          createdAt:x["comment.createdAt"]||'null',
          agree:x['comment.user.votes.vote']?true:false
        }
      })
    });
  });
};