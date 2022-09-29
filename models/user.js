const mongoos = require('mongoose');

const userSchema = new mongoos.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        required:true,
    },
    Date:{
        type: Date,
        required: false,
    }
});

const userModel = mongoos.model('users', userSchema);
module.exports=userModel;