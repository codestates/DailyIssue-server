const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports={
  async get(req,res,next){
    console.log('small ???');
    const auth=req.headers['authorization'];
    const smallIssues=await model.post.findAll({
      where:{
        "userId":{
          [model.Sequelize.Op.ne]:1
        }
      }
    })
    if(smallIssues.length===0){
      res.status(404).send("No Small Issue");
      return;
    }
    const smallIssue=smallIssues[Math.floor(Math.random()*(smallIssues.length))];
    const smallIssueId=smallIssue.id;
    const vote=await model.vote.findAll({
      attributes:[
        "vote",
        [model.sequelize.fn('COUNT','*'), 'count']
      ],
      where:{
        postId:smallIssueId,
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
          'postId':smallIssueId
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
        smallIssue,
        voted:false,
        agree:vote.filter(x=>x.vote).reduce((acc,x)=>x.dataValues.count,0),
        disgree:vote.filter(x=>!x.vote).reduce((acc,x)=>x.dataValues.count,0),
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
        postId:smallIssueId,
        userId:data.id
      })
      const voted=(userVoted.length>0)?true:false;
      if(voted){
        res.send({
          ...smallIssue,
          voted,
          comments
        });
      }
      else{
        res.send({
          ...smallIssue,
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