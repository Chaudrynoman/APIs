const jwt=require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token=req.get('Authorization');
    if(!token){
        const err=new Error('Not Authorized');
        err.status=401;
        throw err;
    }
    let decodedtoken;
    try{
        decodedtoken=jwt.verify(token,'securesecret')
    }
    catch(err){
        throw err;
    }
    if(!decodedtoken){
        const err= new Error();
        err.status=401;
        err.message="Not Authorized"
        throw err;
    }
    req.userId=decodedtoken.id;
    next();
}