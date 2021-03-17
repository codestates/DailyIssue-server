const cookieParser = require("cookie-parser");
const express=require('express');
const mainRouter=require('./routes/main');
const authRouter=require('./routes/auth');
const mypageRouter=require('./routes/mypage');
const app = express();
const port = 4000;
const cors=require('cors');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: "*",
    method:['GET','POST','OPTION'],
    credentials:true
}));
app.use(cookieParser());

app.use('/main',mainRouter);
app.use('/mypage',mypageRouter);
app.use('/',authRouter);

app.listen(port,()=>{
    console.log(`server on ${port}`);
});