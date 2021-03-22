const express= require('express');
const router=express.Router();
const controller=require('../controllers/main');

router.get('/',controller.main);
router.post('/vote',controller.vote);
router.post('/comment',controller.comment);
router.get('/like',controller.totalLike);
router.post('/like',controller.postLike);
router.get('/small',controller.small.get);
router.get('/small/:id',controller.small.getById);
router.post('/small',controller.small.post);
router.get('/hotissue',(req,res)=>controller.hotIssue(req,res));
router.get('/hotissue/:date',(req,res)=>controller.hotIssue(req,res,req.params.date));
router.get('/:date',controller.previousMain);

module.exports=router;