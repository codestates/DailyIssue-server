const express= require('express');
const router=express.Router();
const controllers = require("../controllers/authentication");

router.post('/signup', controllers.signUp);
router.post('/login', controllers.login);
router.get('/accTokenRequestUser', controllers.accTokenRequestUser);
router.get('/rfTokenRequest', controllers.rfTokenRequest);
router.post('/callbackGit', controllers.callbackGit);
router.get('/callback', controllers.callback);
router.get('/callbackRf', controllers.callbackRf);

module.exports=router;