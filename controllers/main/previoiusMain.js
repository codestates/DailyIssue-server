const model=require("../../models");
const sendIssue = require("./modules/sendIssue");

module.exports=async function(req,res){
  let dateObj;
  try{
    dateObj=new Date(req.params.date);
  }
  catch(e){
    res.status(400).send(`${req.params.date}is not date`);
    return;
  }
  const nextDateObj=new Date(dateObj.getTime()+(24*60*60*1000));
  const dailyIssue=await model.post.findOne({
    where:{
      createdAt:{
        [model.Sequelize.Op.in]:[dateObj,nextDateObj]
      },
      userId:1
    }
  });
  if(dailyIssue){
    sendIssue(req,res,dailyIssue,true);
    return;
  }
  const defaultDailyIssue=await model.post.findByPk(1);
  sendIssue(req,res,defaultDailyIssue.id,true);
}