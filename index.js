const controllers = require("./controllers");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express=require('express');

const app = express();
const port = 4000;
app.use(express.json());
app.use(
    cors({
        origin: '*',
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
    })
);
app.use(cookieParser());

// authentication
app.post('/signup', controllers.signUp);
app.post('/login', controllers.login);
app.get('/accTokenRequestUser', controllers.accTokenRequestUser);
app.get('/rfTokenRequest', controllers.rfTokenRequest);
// mypage
app.get('/mypage', controllers.mypageRequest);
app.post('/changPwRequest', controllers.changePwRequest);

app.listen(port,()=>{
    console.log(`server on ${port}`);
});