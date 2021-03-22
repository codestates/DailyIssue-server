const model=require("../../models");
const sendIssue = require("./modules/sendIssue");

module.exports=async function(req,res){
  const dailyIssueId=1;
  const dailyIssue=await model.post.findByPk(dailyIssueId);
  sendIssue(req,res,dailyIssue)
  //res.send("this is main");
}