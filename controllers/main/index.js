const main=require("./main.js");
const previousMain=require("./previoiusMain.js");
const vote=require("./vote.js");
const comment=require("./comment.js");
const totalLike=require("./totalLike.js");
const postLike=require("./postLike");
const small=require("./small");

let hotIssueId=1;

module.exports={
  main:(req,res)=>main(req,res,hotIssueId),
  previousMain,
  vote,
  comment,
  totalLike,
  postLike,
  small
};