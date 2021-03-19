const model=require("../../models");
const sendIssue = require("./modules/sendIssue");

module.exports=async function(req,res){
  let dailyIssue;
  if(req.params.date.match(/dddd-dd-dd/)){ //날짜인지확인하는부분 자세하게구현할필요있음
    dailyIssue=await model.post.findOne({
      where:{
        createdAt:req.parms.date,
        userId:1
      }
    });
  }
  if(dailyIssue){
    dailyIssueId=dailyIssue.postId;
  }
  else{
    dailyIssue=await model.post.findByPk(1);
  }
  sendIssue(res,dailyIssue,auth,true);
}