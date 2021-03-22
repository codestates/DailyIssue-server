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
      return;
    }
    await model.vote.findOrCreate({
      where:{
        userId:data.id,
        postId:postId
      },
      defaults:{
        vote:req.body.vote
      }
    });
    const tmp=getVoteNComments(postId);
    const vote=await tmp.vote;
    const comments=await tmp.comments;
    res.send({
      voted:req.body.vote,
      agree:vote.filter(x=>x.vote).reduce((acc,x)=>x.dataValues.count,0),
      disagree:vote.filter(x=>!x.vote).reduce((acc,x)=>x.dataValues.count,0),
      comments:comments.map(x=>{
        return {
          commentId:x["comment.id"],
          text:x["comment.content"],
          like:x.like,
          createdAt:x.createdAt||'null',
          agree:x['comment.user.votes.vote']?true:false
        }
      })
    });
  });
};
