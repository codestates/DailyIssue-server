const model=require("../../models");
const sendIssue = require("./modules/sendIssue");

module.exports=async function(req,res){
  let dateObj=new Date();
  if(req.params.date){
    try{
      dateObj=new Date(req.params.date);
    }
    catch(e){
      res.status(400).send(`${req.params.date}is not date`);
      return;
    }
  }
  let i=Math.floor((dateObj.getTime()-(new Date("2020-01-01")).getTime())/(24*60*60*1000))%10;
  const nextDateObj=new Date(dateObj.getTime()+(24*60*60*1000));
  const dailyIssue=await model.post.findAll({
    where:{
      userId:1
    },
    order:[['createdAt','desc']]
  });
  if(dailyIssue){
    sendIssue(req,res,dailyIssue[i],true);
    return;
  }
  res.status(404).send('no issue');
  return;
  // const dailyIssueId=1;
  // const dailyIssue=await model.post.findByPk(dailyIssueId);
  // sendIssue(req,res,dailyIssue)
  //res.send("this is main");
}