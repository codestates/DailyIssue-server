const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=async function(req,res){
  const smallIssues=await model.vote.findAll({
    attributes:[
      [model.Sequelize.fn('COUNT','*'),'cnt']
    ],    
    include:{
      model:model.post,
      where:{
        "userId":{
          [model.Sequelize.Op.ne]:1
        }
      },
      right:true,
      required:false,
      attributes:['title','id']
    },
    group:'post.id',
    order:[[model.Sequelize.literal('cnt'),'desc']],
    limit:3
  });
  res.send({
    hotIssues:smallIssues.map(x=>{
      return {
        postId:x.dataValues['post.id'],
        title:x.dataValues['post.title']
      }
    })
  });
};