const expect=require('chai').expect;
const isAuth = require('../middleware/is-auth');
const jwt=require('jsonwebtoken');
const sinon=require('sinon');

describe('Authorization middleware.',function(){
    it('should throw an error if no Autherization header is present ',function(){
        const req={
            get: function(){
                return null;
            }
        };
        expect(isAuth.bind(this,req,{},()=>{})).to.throw('Not Authorized');
    });
    it('should return userid after decoding the token.',function(){
        const req={
            get: function(){
                return 'abc';
            }
        };
        // jwt.verify=function(){
        //     return {userid: 'abc'};//it return error in last because it create globaly
        // }
        sinon.stub(jwt,'verify');//stub verify the jwt 
        jwt.verify.returns({userid: 'abc'});//return userid
        isAuth(req,{},()=>{});
        expect(req).to.have.property('userId');
        expect(jwt.verify.called).to.be.true;//if jwt verify call in function if not it will throw error
        jwt.verify.restore();//jwt return in it original shape...
    });
    it('should throw an error if Autherization code is not correct.',function(){
        const req={
            get: function(){
                return 'abc';
            }
        };
        expect(isAuth.bind(this,req,{},()=>{})).to.throw();
    });
    
});
