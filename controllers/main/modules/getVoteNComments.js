const model=require("../../../models");

module.exports=(issue)=>{
  const vote=model.vote.findAll({
    attributes:[
      "vote",
      [model.sequelize.fn('COUNT','*'), 'count']
    ],
    where:{
      postId:issue.id,
    },
    group:'vote'  
  });
  const comments=model.like.findAll({
    attributes:[
      [model.sequelize.fn('COUNT','*'), 'like']
    ],
    include:[{
      right:true,
      require:false,
      model:model.comment,
      attributes:['id','content','createdAt'],
      where:{
        'postId':issue.id
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
  return {
    vote,
    comments
  }
}