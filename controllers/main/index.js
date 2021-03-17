const model=require("../../models");
const dummy=function(req,res,next){
  res.send('dummy');
}
const jwt=require('jsonwebtoken');
let hotIssueId=1;
module.exports={
  async main(req,res){
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
    jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,(err,data)=>{
      if(err){
        //invalid token
        res.status(404).send("Invalid token")
        return;
      }
      const voted=true;
      if(voted){
        const comments=[{
          username:"user",
          text:'text',
          like:5
        }];
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
  },
  previousMain: dummy,
  vote:dummy,
  comment:{
    get:dummy,
    post:dummy,
  },
  totalLike:dummy,
  postLike:dummy,
  small:{
    get:dummy,
    post:dummy,
  }
};