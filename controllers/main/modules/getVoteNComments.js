const model=require("../../../models");

module.exports=(issueId)=>{
  const vote=model.vote.findAll({
    attributes:[
      "vote",
      [model.sequelize.fn('COUNT','*'), 'count']
    ],
    where:{
      'postId':issueId,
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
        'postId':issueId
      },
      include:[{
        model:model.user,
        attributes:['nickname'],
        require:false,
        include:[{
          model:model.vote,
          attributes:['vote'],
          where:{
            'postId':issueId
          }
        }]
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