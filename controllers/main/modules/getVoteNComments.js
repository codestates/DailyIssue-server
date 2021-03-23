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
      [model.sequelize.fn('COUNT',model.Sequelize.col('commentId')), 'like']
    ],
    include:[{
      model:model.comment,
      attributes:['id','content','createdAt'],
      where:{
        'postId':issueId
      },
      include:[{
        model:model.user,
        attributes:['nickname'],
        include:[{
          model:model.vote,
          attributes:['vote'],
          where:{
            'postId':issueId
          }
        }],
        required:true
      }],
      required:false,
      right:true,
    }],
    raw:true,
    group:'comment.id',
  });

  return {
    vote,
    comments
  }
}