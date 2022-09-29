const jwt=require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token=req.get('authorizations');
    let decodedtoken;
    try{
        decodedtoken=jwt.verify(token,'securesecret')
    }
    catch(err){
        const status=err.status || 500;
        const message=err.message;
        res.status(status).json({Sucess:false,Message:message});
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