const controllers = require("./controllers");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express=require('express');
const mainRouter=require('./routes/main');

const app = express();
const port = 4000;
const cors=require('cors');
const mainRouter=require('./routes/main');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: "*",
    method:['GET','POST','OPTION'],
    credentials:true
}));
app.use(cookieParser());

// authentication
app.post('/signup', controllers.signUp);
app.post('/login', controllers.login);
app.get('/accTokenRequestUser', controllers.accTokenRequestUser);
app.get('/rfTokenRequest', controllers.rfTokenRequest);
// mypage
app.get('/mypage', controllers.mypageRequest);
app.post('/changPwRequest', controllers.changePwRequest);

app.use('/main',mainRouter);

app.listen(port,()=>{
    console.log(`server on ${port}`);
});