const express= require('express');
const router=express.Router();
const controller=require('../controllers/main');

router.get('/',controller.main);
router.get('/:date',controller.previousMain);
router.post('/vote',controller.vote);
router.get('/comment',controller.comment.get);
router.post('/comment',controller.comment.post);
router.get('/like',controller.totalLike);
router.post('/like',controller.postLike);
router.get('/small',controller.small.get);
router.post('/small',controller.small.post);

module.exports=router;