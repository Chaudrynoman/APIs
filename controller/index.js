const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const jwt=require('jsonwebtoken');
const userModel = require('../models/user');
const err= new Error();
exports.postLogin = async(req, res, next) => {
    try{
        const {Email,Password}=req.body;
        const errors =validationResult(req);
        const err= new Error();
        if (!errors.isEmpty()) {
            err.status=422;
            err.message=errors.array()[0].msg;
            throw err;
        }
        const user=await userModel.findOne({ Email: Email });
        if (!user) {
            err.status=422;
            err.message="This Email is not Register!";
            throw err;
        }
        const doMatch=await bcrypt.compare(Password, user.Password);
            if (doMatch) {
                const token=jwt.sign({
                    Email: Email,
                    id: user._id.toString(),
                    expiresIn: '1h'
                },
                'securesecret',
                );
                return res.status(200).json({Suceess:true,Message:"Sucessfully LogIn!",Token:token,value:token.id});
            }
            err.status=401;
            err.message="Password Incorrect!";
            throw err;
    }
    catch(err){
        next(err);
    }
  };
  exports.postSignup = async(req, res, next) => {
    try{
        const {Email,Name,Password,Role}=req.body;
        const date = new Date();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err.status=422;
            err.message=errors.array()[0].msg;
            throw err;
        }
        const user=await userModel.findOne({ Email: Email });
        if (user) {
            err.status=401;
            err.message="E-Mail exists already, please pick a different one.";
            throw err;
            
        }
        const hashedPassword=await bcrypt.hash(Password, 12);
        const Newuser = new userModel({
          Email: Email,
          Password: hashedPassword,
          Name: Name,
          Role: Role,
          Date: date
        });
        Newuser.save();
        return res.status(201).json({Suceess:true,Message:"Sucessfully Registered!"});
    }
    catch(err){
        next(err);
    }
}
exports.getprofile=async(req,res,next)=>{
    try
    {
        const id=req.userId;
        const results = await userModel.findById(id).lean();
        return res.json({success: true, data: results ? results : {},Message:results ? "Sucessfully Don":"No Data Found"});
    }
    catch(err)
    {
        next(err);
    }
}
exports.putPassword=async(req,res,next)=>{
    try{
        const id=req.userId;
        const {oldPassword,newPassword}=req.query;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err.status=422;
            err.message=errors.array()[0].msg;
            throw err;
        }
        const newuser=await userModel.findById(id);
        const doMatch=await bcrypt.compare(oldPassword, newuser.Password);
        if (doMatch) {
            const hashedPassword=await bcrypt.hash(newPassword, 12);
            newuser.Password=hashedPassword;
            newuser.save();
            return res.status(200).json({Suceess:true,Message:"Sucessfully Password has been changed."});
        }
        err.status=401;
        err.message="Incorrect old Password";
        throw err;
    }
    catch(err){
        next(err);
    }
}
exports.getstats=async(req,res,next)=>{
    try
    {
        const id=req.userId;
        const today = new Date();
        const previse=today-(1000*60*60*24*30*6);
        const newuser = await userModel.findById(id).lean();
        if(newuser.Role==="admin"){
            const results=await userModel.where("Date").gte(previse).select("Name");
            // const results = await userModel.aggregate([
            //     { 
            //         $addFields: { 
            //             PreviousDate: { $subtract: [  today, (1000*60*60*24*30*6) ] } 
            //         } 
            //     },
            //     { 
            //         $group: { 
            //             _id: "$_id",
            //             Name: { "$first": "$Name" },
            //             count: { 
            //                 $sum: { $cond: [ { $gte: [ "$Date", "$PreviousDate" ] }, 1, 0 ]  } 
            //             } 
            //         } 
            //     },
            //     { $match : { count: 1 } }
            //   ])
            return res.json({success: true, data: results ? results : {},Message:results ? "Sucessfully Don":"No Data Found"});
        }
        err.status=403;
        err.message="Your are not Authorized.";
        throw err;
    }
    catch(err)
    {
        next(err);
    }
}