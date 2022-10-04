const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
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
                res.status(200).json({Suceess:true,Message:"Sucessfully LogIn!",Token:token,value:token.id});
                return;
            }
            err.status=401;
            err.message="Password Incorrect!";
            throw err;
    }
    catch(err){
        next(err);
        return err;
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
        res.status(201).json({Suceess:true,Message:"Sucessfully Registered!"});
        return;
    }
    catch(err){
        next(err);
        return err;
    }
}
exports.getprofile=async(req,res,next)=>{
    try
    {
        const id=req.userId;
        const results = await userModel.findById(id).lean();
        res.status(200).json({success: true, data: results ? results : {},Message:results ? "Sucessfully Don":"No Data Found"});
        return;
    }
    catch(err)
    {
        next(err);
        return err;
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
            res.status(200).json({Suceess:true,Message:"Sucessfully Password has been changed."});
            return;
        }
        err.status=401;
        err.message="Incorrect old Password";
        throw err;
    }
    catch(err){
        next(err);
        return err;
    }
}
exports.getstats=async(req,res,next)=>{
    try
    {
        const id=req.userId;
        const today = new Date();
        const previse=today-(1000*60*60*24*30*6);
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 6;
        const result = {};
        let totalPosts;
        const startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        // const sortMap = new Map();
        // sortMap.set('Date', 1);
        // // sortMap.set('Name', -1);
        const newuser = await userModel.findById(id).lean();
        if(newuser.Role==="admin"){
            totalPosts = await userModel.countDocuments().exec();
            result.user=await userModel.where("Date").gte(previse).select("Name")
            .skip(startIndex)
            .limit(limit)
            .sort({Date: 1, Name: 1})
            .exec();
            result.totalPosts = totalPosts;
            if (startIndex > 0) {
                result.previous = {
                    pageNumber: pageNumber - 1,
                    limit: limit,
                };
            }
            if (endIndex < totalPosts) {
                result.next = {
                    pageNumber: pageNumber + 1,
                    limit: limit,
                };
            }
            result.rowsPerPage = limit;
            
            // result.user = await userModel.aggregate([
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
            //     { $match : { count: 1 } },
            //     { $sort : sortMap }
            //   ]
            // )
            // .skip(startIndex)
            // .limit(limit)
            // .exec();
            // result.totalPosts = totalPosts;
            // if (startIndex > 0) {
            //     result.previous = {
            //         pageNumber: pageNumber - 1,
            //         limit: limit,
            //     };
            // }
            // if (endIndex < totalPosts) {
            //     result.next = {
            //         pageNumber: pageNumber + 1,
            //         limit: limit,
            //     };
            // }
            // result.rowsPerPage = limit;
            res.status(200).json({success: true, data: result.user ? result : {},Message:result.user ? "Sucessfully Don":"No Data Found"});
            return;
        }
        err.status=403;
        err.message="Your are not Authorized.";
        throw err;
    }
    catch(err)
    {
        next(err);
        return err;
    }
    
}
exports.getData=async (req,res,next)=>{
    try{
        const text=req.query.text;
        const email=req.query.email;
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 6;
        const result = {};
        let totalPosts;
        const startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        if(text){
            totalPosts = await userModel.countDocuments({ $text: { $search: text } }).exec();
            result.user=await userModel.find( { $text: { $search: text } } )
            .sort({Date: 1, Name: 1})
            .skip(startIndex)
            .limit(limit)
            .exec();
            
        }
        if(email){
            totalPosts = await userModel.countDocuments({ Email: email }).exec();
            result.user=await userModel.find( { Email: email } )
            .sort({Date: 1, Name: 1})
            .skip(startIndex)
            .limit(limit)
            .exec();
        }
        
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < totalPosts) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }
        result.rowsPerPage = limit;
        res.status(200).json({success: true, data: result.user ? result : {},Message: result.user ? "Sucessfully Don":"No Data Found"});
        return;
    }
    catch{
        next(err);
        return err;
    }
}