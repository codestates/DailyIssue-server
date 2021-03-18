const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports={
  async get(req,res,next){
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
        dailyIssue,
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
        postId:dailyIssueId,
        userId:data.id
      })
      const voted=(userVoted.length>0)?true:false;
      if(voted){
        res.send({
          ...dailyIssue,
          voted,
          comments
        });
      }
      else{
        res.send({
          ...dailyIssue,
          voted
        });
      }
    });
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