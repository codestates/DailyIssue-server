const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=async function(req,res,date){
  let dateObj;
  if(!date){
    const tmp=new Date();
    dateObj=`${tmp.getFullYear()}-${tmp.getMonth()}-${tmp.getDate()}`;
  }
  else{
    try{
      dateObj=new Date(date);
    }
    catch(e){
      res.status(400).send(`${date}is not date`);
      return;
    }
  }
  const nextDateObj=new Date(dateObj.getTime()+(24*60*60*1000));
  const smallIssues=await model.vote.findAll({
    attributes:[
      [model.Sequelize.fn('COUNT','*'),'cnt']
    ],    
    include:{
      model:model.post,
      where:{
        "userId":{
          [model.Sequelize.Op.ne]:1
        },
        "createdAt":{
          [model.Sequelize.Op.in]:[dateObj,nextDateObj]
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