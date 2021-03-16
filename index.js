const express=require('express');

const app=express();
const port=4000;

app.use('/',(req,res)=>{
    res.send('hello word pipe piper');
});

app.listen(port,()=>{
    console.log(`server on ${port}`);
});