const expect=require('chai').expect;
const usercontroller=require('../controller/index');
const sinon=require('sinon');
const jwt=require('jsonwebtoken');
const user = require('../models/user');
const { default: mongoose } = require('mongoose');

describe('User Controller SignUp foam.',function(){
    it('should throw an error with status code 500 when accessing the database fails. ',function(done){
        sinon.stub(user,'findOne')
        user.findOne.throws();
        const req={
            body:{
                Email: "gmail.com",
                Password: "abcdef",
                Name: "abcdef",
                Role: "admin",
                Date: "2022-09-27T06:51:50.577+00:00",
                _id: '63354087c50a6f8e02caf311'  
            }
        };
        usercontroller.postSignup(req,{},()=>{}).then(result =>{
            expect(result).to.be.an('error');
            // expect(result).to.have.property('status',500);
            done();
        });
        user.findOne.restore();
    })
    it('should send a response with a valid user status  for an inerting user.',function(done){
        mongoose.connect('mongodb://localhost:27017/test?retryWrites=true&w=majority')
        .then(result=>{
            // const use= new user({
            //     Email: "gmail.com",
            //     Password: "abcdef",
            //     Name: "abcdef",
            //     Role: "admin",
            //     Date: "2022-09-27T06:51:50.577+00:00",
            //     _id: '63354087c50a6f8e02caf311'
            // });
            // return use.save();
        })
        .then(()=>{
            const req={
                body:{
                    Email: "test12@gmail.com",
                    Password: "abcdef",
                    Name: "abcdef",
                    Role: "admin",
                    Date: "2022-09-27T06:51:50.577+00:00",
                    _id: '63354087c50a6f8e02caf311'
                }
            };
            const res={
                statuscode:100,
                userstatuscode:null,
                status:function (code){
                    this.statuscode=code;
                    return this;
                }
            };
            usercontroller.postSignup(req,res,()=>{}).then(result =>{
                expect(res.statuscode).is.be.equal(201);
            }).then(()=>{
                user.deleteMany({}).exec();
                done();
            })
        })
        .catch(err=>{});
    })
    
});
describe('User Controller LoggIn foam.',function(){
    it('should throw an error with status code 500 when accessing the database fails. ',function(done){
        sinon.stub(user,'findOne')
        user.findOne.throws();
        const req={
            body:{
                Email: "gmail.com",
                Password: "abcdef",
               
            }
        };
        usercontroller.postLogin(req,{},()=>{}).then(result =>{
            expect(result).to.be.an('error');
            // expect(result).to.have.property('status',500);
            done();
        });
        user.findOne.restore();
    })
    it('should send a response with a valid user status  for an existing user.',function(done){
        mongoose.connect('mongodb://localhost:27017/test?retryWrites=true&w=majority')
        .then(result=>{
            const use= new user({
                Email: "gmail.com",
                Password: "abcdef",
                Name: "abcdef",
                Role: "admin",
                Date: "2022-09-27T06:51:50.577+00:00",
                _id: '63354087c50a6f8e02caf311'
            });
            return use.save();
        })
        .then(()=>{
            const req={
                body:{
                    Email: "test12@gmail.com",
                    Password: "abcdef"
                }
            };
            const res={
                statuscode:100,
                userstatuscode:null,
                status:function (code){
                    this.statuscode=code;
                    return this;
                }
            };
            usercontroller.postLogin(req,res,()=>{}).then(result =>{
                expect(res.statuscode).is.be.equal(200);
            }).then(()=>{
                user.deleteMany({}).exec();
                done();
            })
        })
        .catch(err=>{});
    })
    
});
describe('User Controller see Perfile foam.',function(){
    it('should throw an error with status code 500 when accessing the database fails. ',function(done){
        sinon.stub(user,'findOne')
        user.findOne.throws();
        const req={
            body:{
                userid:'63354087c50a6f8e02caf311'               
            }
        };
        usercontroller.getprofile(req,{},()=>{}).then(result =>{
            expect(result).to.be.an('error');
            // expect(result).to.have.property('status',500);
            done();
        });
        user.findOne.restore();
    })
    it('should send a response with a valid user status  for an existing user.',function(done){
        mongoose.connect('mongodb://localhost:27017/test?retryWrites=true&w=majority')
        .then(result=>{
            const use= new user({
                Email: "gmail.com",
                Password: "abcdef",
                Name: "abcdef",
                Role: "admin",
                Date: "2022-09-27T06:51:50.577+00:00",
                _id: '63354087c50a6f8e02caf311'
            });
            return use.save();
        })
        .then(()=>{
            const req={userid:'63354087c50a6f8e02caf311'};
            const res={
                statuscode:100,
                userstatuscode:null,
                status:function (code){
                    this.statuscode=code;
                    return this;
                }
            };
            usercontroller.getprofile(req,res,()=>{}).then(result =>{
                expect(res.statuscode).is.be.equal(200);
            }).then(()=>{
                user.deleteMany({}).exec();
                mongoose.disconnect();
                done();
            })
        })
        .catch(err=>{});
    })
    
});
describe('User Controller change pasword foam.',function(){
    it('should throw an error with status code 500 when accessing the database fails. ',function(done){
        sinon.stub(user,'findOne')
        user.findOne.throws();
        const req={
            body:{
                userid:'63354087c50a6f8e02caf311'               
            }
        };
        usercontroller.putPassword(req,{},()=>{}).then(result =>{
            expect(result).to.be.an('error');
            // expect(result).to.have.property('status',500);
            done();
        });
        user.findOne.restore();
    })
    // it('should send a response with a valid user status  for an existing user.',function(done){
    //     mongoose.connect('mongodb://localhost:27017/test?retryWrites=true&w=majority')
    //     .then(()=>{
    //         const use= new user({
    //             Email: "gmail.com",
    //             Password: "abcdef",
    //             Name: "abcdef",
    //             Role: "admin",
    //             Date: "2022-09-27T06:51:50.577+00:00",
    //             _id: '633c4cf7902b0480b0de0ba6'
    //         });
    //         use.save();
    //     })
    //     .then(()=>{
    //         let req={userid:'633c4cf7902b0480b0de0ba6'};
    //         req={
    //             query:{
    //                 oldPassword:'abcdef',
    //                 newPassword:'test123'
    //             }
    //         }
    //         const res={
    //             statuscode:100,
    //             userstatuscode:null,
    //             status:function (code){
    //                 this.statuscode=code;
    //                 return this;
    //             }
    //         };
    //         usercontroller.putPassword(req,res,()=>{}).then(result =>{
    //             console.log(result);
    //             expect(res.statuscode).is.be.equal(200);
    //         }).then(()=>{
    //             user.deleteMany({}).exec();
    //             mongoose.disconnect();
    //             done();
    //         })
    //     })
    //     .catch(err=>{});
    // })
    
});
describe('User Controller see stats foam.',function(){
    it('should throw an error with status code 500 when accessing the database fails. ',function(done){
        sinon.stub(user,'findOne')
        user.findOne.throws();
        const req={
            body:{
                userid:'63354087c50a6f8e02caf311'               
            }
        };
        usercontroller.getstats(req,{},()=>{}).then(result =>{
            expect(result).to.be.an('error');
            // expect(result).to.have.property('status',500);
            done();
        });
        user.findOne.restore();
    })
    it('should send a response with a valid user status  for an existing user.',function(done){
        mongoose.connect('mongodb://localhost:27017/test?retryWrites=true&w=majority')
        .then(result=>{
            const use= new user({
                Email: "gmail.com",
                Password: "abcdef",
                Name: "abcdef",
                Role: "admin",
                Date: "2022-09-27T06:51:50.577+00:00",
                _id: '63354087c50a6f8e02caf311'
            });
            return use.save();
        })
        .then(()=>{
            const req={userid:'63354087c50a6f8e02caf311'};
            const res={
                statuscode:100,
                userstatuscode:null,
                status:function (code){
                    this.statuscode=code;
                    return this;
                }
            };
            usercontroller.getstats(req,res,()=>{}).then(result =>{
                expect(res.statuscode).is.be.equal(100);
            }).then(()=>{
                user.deleteMany({}).exec();
                mongoose.disconnect();
                done();
            })
        })
        .catch(err=>{});
    })
    
});
describe('User Controller see data from text and email field.',function(){
    it('should throw an error with status code 500 when accessing the database fails. ',function(done){
        sinon.stub(user,'findOne')
        user.findOne.throws();
        const req={
            body:{
                userid:'63354087c50a6f8e02caf311'               
            }
        };
        usercontroller.getData(req,{},()=>{}).then(result =>{
            expect(result).to.be.an('error');
            // expect(result).to.have.property('status',500);
            done();
        });
        user.findOne.restore();
    })
    it('should send a response with a valid user status  for an existing user.',function(done){
        mongoose.connect('mongodb://localhost:27017/test?retryWrites=true&w=majority')
        .then(()=>{
            const use= new user({
                Email: "gmail.com",
                Password: "abcdef",
                Name: "abcdef",
                Role: "admin",
                Date: "2022-09-27T06:51:50.577+00:00",
                _id: '633c4cf7902b0480b0de0ba6'
            });
            use.save();
        })
        .then(()=>{
            req={
                query:{
                    text:'abcdef',
                    email:'gmail.com'
                }
            }
            const res={
                statuscode:100,
                userstatuscode:null,
                status:function (code){
                    this.statuscode=code;
                    return this;
                }
            };
            usercontroller.getData(req,res,()=>{}).then(result =>{
                console.log(result.message);
                expect(res.statuscode).is.be.equal(100);
            }).then(()=>{
                user.deleteMany({}).exec();
                mongoose.disconnect();
                done();
            })
        })
        .catch(err=>{});
    })
    
});