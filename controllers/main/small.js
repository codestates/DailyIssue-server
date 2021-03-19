const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports={
  async getById(req,res){
    const auth=req.headers['authorization'];
    const smallIssue=await model.post.findByPk(req.params.id);
    if(smallIssue===null || Object.keys(smallIssue).length===0){
      res.status(404).send("No Such Small Issue");
      return;
    }
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
        postId:smallIssue.id,
        title:smallIssue.title,
        voted:0,
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
        where:{
          postId:smallIssueId,
          userId:data.id
        }
      })
      if(voted){
        res.send({
          postId:smallIssue.id,
          title:smallIssue.title,
          voted:(userVoted.length>0)? (userVoted[0].vote? 2:1):0,
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
          postId:smallIssue.id,
          title:smallIssue.title,
          voted:0
        });
      }
    });

  },
  async get(req,res,next){
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
        postId:smallIssue.id,
        title:smallIssue.title,
        voted:0
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
        where:{
          postId:smallIssueId,
          userId:data.id
        }
      })
      if(voted){
        res.send({
          postId:smallIssue.id,
          title:smallIssue.title,
          voted:(userVoted.length>0)? (userVoted[0].vote? 2:1):0,
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
          postId:smallIssue.id,
          title:smallIssue.title,
          voted:0
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