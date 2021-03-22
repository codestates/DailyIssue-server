const cookieParser = require("cookie-parser");
const express=require('express');
const mainRouter=require('./routes/main');
const authRouter=require('./routes/auth');
const mypageRouter=require('./routes/mypage');
const reportRouter=require('./routes/report');

const app = express();
const port = 4000;
const cors=require('cors');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: "http://localhost:3000",
    method:['GET','POST','OPTION'],
    credentials:true
}));
app.use(cookieParser());

app.options(cors({
    origin: "localhost:3000",
    method:['GET','POST','OPTION'],
    credentials:true
}));
app.use('/main',mainRouter);
app.use('/mypage',mypageRouter);
app.use('/report',reportRouter);
app.use('/',authRouter);

app.listen(port,()=>{
    console.log(`server on ${port}`);
});