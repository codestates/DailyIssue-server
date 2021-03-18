const express= require('express');
const router=express.Router();
const controllers = require("../controllers/mypage");

router.get('/', controllers.mypageRequest);
router.post('/changePwRequest', controllers.changePwRequest);

module.exports=router;