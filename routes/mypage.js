const express= require('express');
const router=express.Router();
const controllers = require("../controllers/mypage");

router.get('/mypage', controllers.mypageRequest);
router.post('/changPwRequest', controllers.changePwRequest);

module.exports=router;