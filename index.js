const express = require('express');
const app=express();
const morgan=require('morgan');



app.use(morgan('common'));
app.use((req,res,next)=>{
    req.requestTime=Date.now();
    console.log("first call");
    return next();
})

app.use((req,res,next)=>{
    console.log("second call");
    return next();
})
app.get('/test',(req,res,next)=>{
    console.log("Testing middleware");
    return next();
})

app.get('/',(req,res)=>{
    res.send("Home Page");
})


app.get('/test',(req,res)=>{
    console.log(`requestTime : ${req.requestTime}`);
    res.send("Testing");
})


app.use((req,res)=>{
    res.status(404).send('Not Found!');
})

app.listen(3000,()=>{
    console.log("App is listening on port 3000");
})