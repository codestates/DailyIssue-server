const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=async function(req,res,date){
  if(!date){
    const tmp=new Date();
    date=`${tmp.getFullYear()}-${(tmp.getMonth()+1)}-${tmp.getDate()}`;
  }
  else{
    try{
      new Date(date);
    }
    catch(e){
      res.status(400).send(`${date}is not date`);
      return;
    }
  }
  const smallIssues=await model.vote.findAll({
    attributes:[
      [model.Sequelize.fn('COUNT',model.Sequelize.col('vote')),'cnt']
    ],    
    include:{
      model:model.post,
      required:false,
      right:true,
      attributes:['title','id',"userId"]
    },
    where:{
      [model.Sequelize.Op.and]:[
        model.Sequelize.where(model.Sequelize.fn("DATE",model.Sequelize.col('post.createdAt')),date),
        {
          userId:{
            [model.Sequelize.Op.ne]:1
          }
        }
      ]
    },
    group:'post.id',
    order:[[model.Sequelize.literal('cnt'),'desc'],[model.Sequelize.literal('post.id'),'desc']],
    limit:3
  });
  res.send({
    hotIssues:smallIssues.map(x=>{
      console.log(x.dataValues);
      return{
        postId:x.post.id,
        title:x.post.title,
        createdAt:x.post.createdAt
      }
    })
  });
};