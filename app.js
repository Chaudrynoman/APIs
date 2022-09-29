const express=require('express');
const mongoose=require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const MONGO_URL="mongodb://localhost:27017/Assignment?retryWrites=true&w=majority";
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(userRoutes);
app.use((error,req, res, next) => {
  const status=error.status || 500;
  const message=error.message;
  res.status(status).json({Sucess:false,Message:message});
});
try{
  mongoose.connect(MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
}
catch(err){
  console.log(err);
}
app.listen('3001', ()=>{
  console.log("Running on port 3001");
});