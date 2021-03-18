const model=require("../../models");
const jwt=require('jsonwebtoken');
const comment = require("../main/comment");

module.exports={
  async issue(req,res){
    res.send("dummy");
  },
  async comment(req,res){
    res.send("dummy");
  }
}