const model=require("../../models");
const sendIssue = require("./modules/sendIssue");

module.exports=async function(req,res){
  if(!/^\d{4}\-\d{2}\-\d{2}$/.test(req.params.date)){ //날짜인지확인하는부분 자세하게구현할필요있음
    res.status(400).send(`${req.params.date}is not date`);
    return;
  }
  const dailyIssue=await model.post.findOne({
    where:{
      createdAt:req.params.date,
      userId:1
    }
  });
  if(dailyIssue){
    sendIssue(req,res,dailyIssue,true);
    return;
  }
  const defaultDailyIssue=await model.post.findByPk(1);
  sendIssue(req,res,defaultDailyIssue,true);
}