const express= require('express');
const router=express.Router();
const controller=require('../controllers/report');

router.post('/issue',controller.issue);
router.post('/comment',controller.comment);

module.exports=router;