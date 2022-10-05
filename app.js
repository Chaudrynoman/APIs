const express=require('express');
const mongoose=require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const dotenv = require("dotenv");
dotenv.config();
const cors=require('cors');
const logger = require('./logger/app');
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
  mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
}
catch(err){
  logger.error(err);
}
app.listen('3001', ()=>{
  logger.info("Running on port 3001");
});