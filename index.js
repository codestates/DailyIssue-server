const express=require('express');

const app=express();
const port=4000;
const cors=require('cors');
const mainRouter=require('./routes/main');

app.use(cors({
    origin: "*",
    method:['GET','POST','OPTION'],
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/main',mainRouter);
app.use('/',(req,res)=>{
    res.send('hello word pipe piper');
});

app.listen(port,()=>{
    console.log(`server on ${port}`);
});