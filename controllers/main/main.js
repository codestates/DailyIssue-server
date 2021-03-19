const model=require("../../models");
const sendIssue = require("./modules/sendIssue");

module.exports=async function(req,res){
  const dailyIssueId=1;
  const auth=req.headers['authorization'];
  const dailyIssue=await model.post.findByPk(dailyIssueId);
  sendIssue(res,dailyIssue,auth)
  //res.send("this is main");
}