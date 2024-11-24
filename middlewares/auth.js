const auth = (req, res, next) => {
    if(req.user){
      next();
    }
}
module.exports={auth}