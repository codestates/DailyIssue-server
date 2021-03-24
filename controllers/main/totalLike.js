const model=require("../../models");
const jwt=require('jsonwebtoken');

module.exports=function(req,res,next){
  const auth=req.headers['authorization'];
  if(auth===undefined){
    res.status(400).send('Not authorized');
    return;
  }
  jwt.verify(auth.split(' ')[1],process.env.ACCESS_SECRET,async(err,data)=>{
    if(err){
      res.status(400).send({data:err,message:'Invalid authorization'});
      return;
    }
    const likeCount=await model.like.findAll({
      attributes:[
        [model.sequelize.fn('COUNT','*'), 'count']
      ],
      include:[
        {
          model: model.comment,
          where:{
            userId:data.id
          },
          raw:true,
          group:'userId'
        }
      ],
    });
    res.send({
      "like":likeCount.length?likeCount[0].dataValues.count:0
    });
  });
}