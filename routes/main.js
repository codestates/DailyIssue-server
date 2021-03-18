const express= require('express');
const router=express.Router();
const controller=require('../controllers/main');

router.get('/',controller.main);
router.post('/vote',controller.vote);
router.post('/comment',controller.comment);
router.get('/like',controller.totalLike);
router.post('/like',controller.postLike);
router.get('/small',controller.small.get);
router.post('/small',controller.small.post);
router.post('/hotissue',controller.hotIssue);
router.get('/:date',controller.previousMain);

module.exports=router;